const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const gpio = require("node-wiring-pi");
const mcpadc = require("mcp-spi-adc");

const CS_MCP3208 = 10;
const SPI_CHANNEL = 0;
const SPI_CHANNELLight = 1;
const SPI_SPEED = 100000;
const RED = 27;
var QuietSound = 1997;
var sid;
var lid;

const soundsensor = mcpadc.openMcp3208(
  SPI_CHANNEL,
  { speedHZ: SPI_SPEED },
  err => {
    console.log("MCP-ADC 초기화!");
    if (err) console.log("ADC 초기화 실패!(HW점검!)");
  }
);

const lightsensor = mcpadc.openMcp3208(
  SPI_CHANNELLight,
  { speedHZ: SPI_SPEED },
  err => {
    console.log("MCP-ADC 초기화!");
    if (err) console.log("ADC 초기화 실패!(HW점검!)");
  }
);

app.use(bodyParser.urlencoded({ extended: false })); // body parser 환경설정

const SoundDetect = () => {
  soundsensor.read((error, reading) => {
    console.log("▼ ▲ (%d)", reading.rawValue);
    if (reading.rawValue > QuietSound)
      // 필터링 기준값 이상크기이면, 출력
      console.log(
        "기준값:(%d),아날로그 측정값(%d)",
        QuietSound,
        reading.rawValue
      );
    else console.log("인식안함");
  });
  sid = setTimeout(SoundDetect, 200); // 타임아웃 취소용 sid값저장
};

const LightDetect = () => {
  lightsensor.read((error, reading) => {
    console.log("▼ ▲ (%d) light", reading.rawValue);
    let lightPwr = reading.rawValue;
    if (lightPwr === 0) {
      LEDOn(100);
      gpio.softPwmWrite(RED,100);
      console.log(lightPwr);
      
    } else if (lightPwr >= 1 && lightPwr < 820 ) {
      LEDOn(90);
      gpio.softPwmWrite(RED,90);
    //   console.log(lightPwr);
      
    } else if (lightPwr >= 821 && lightPwr < 1230) {
      LEDOn(80);
    //   console.log(lightPwr);
      
    } else if (lightPwr >= 1231 && lightPwr < 1640) {
      LEDOn(70);
    //   console.log(lightPwr);
      
    } else if (lightPwr >= 1641 && lightPwr < 2050) {
      LEDOn(60);

      
    } else if (lightPwr >= 2051 && lightPwr < 2460) {
      LEDOn(45);

      
    } else if (lightPwr >= 2461 && lightPwr < 2870) {
      LEDOn(30);

      
    } else if (lightPwr >= 2871 && lightPwr < 3280) {
      LEDOn(10);

      
    } else if (lightPwr >= 3281 && lightPwr < 3690) {
      LEDOn(1);

      
    } else if (lightPwr >= 3691 && lightPwr <= 4095) {
      LEDOn(0);

      
    }
  });
  lid = setTimeout(LightDetect, 200); // 타임아웃 취소용 sid값저장
};

const LEDOn = pwr => {
  gpio.softPwmWrite(RED, 0);
  gpio.softPwmWrite(RED, pwr);
  console.log(pwr);
};

app.get("/", (req, res) => {
  console.log("sensor 호출");
  fs.readFile("web_analog.html", "utf8", (error, data) => {
    if (!error) res.send(data);
  });
});

app.get("/0", (req, res) => {
  console.log("사운드센서 비활성화 수행");
  clearTimeout(sid); // 타임아웃취소(비활성화)
  res.redirect("/");
});

app.get("/1", (req, res) => {
  console.log("사운드센서 활성화 수행");

  sid = setTimeout(SoundDetect, 200); //활성화
  res.redirect("/");
});

app.get("/2", (req, res) => {
  console.log("광센서 비활성화 수행");

  clearTimeout(lid);
  res.redirect("/");
});

app.get("/3", (req, res) => {
  console.log("광센서 활성화 수행");

  lid = setTimeout(LightDetect, 200); //활성화
  res.redirect("/");
});

app.post("/", (req, res) => {
  let body = req.body;
  console.log("기준값이 다음값으로 설정됩니다.");
  console.log("==> : " + body.threshold);
  QuietSound = body.threshold;
  res.redirect("/");
});

process.on("SIGINT", function() {
  soundsensor.close(() => {
    console.log("MCP-ADC가해제됩니다.");
    console.log("웹 서비스를 종료합니다.");
    process.exit();
  });
  lightsensor.close(() => {
    console.log("MCP-ADC가해제됩니다.");
    console.log("웹 서비스를 종료합니다.");
    process.exit();
  });
  gpio.softPwmWrite(RED, 0);
});

app.listen(60001, () => {
  gpio.wiringPiSetup();
  gpio.pinMode(CS_MCP3208, gpio.OUTPUT);
  gpio.pinMode(RED,gpio.OUTPUT);
  gpio.softPwmCreate(RED,0,100);
  console.log("------------------------------------------------------");
  console.log("사운드센서 제어용 웹서버(인식용기준값:%d)", QuietSound);
  console.log("웹브라우저 접속주소 : http://192.9.114.204:60001/");
  console.log("------------------------------------------------------");
});