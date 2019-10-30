const gpio = require('node-wiring-pi');
const mysql = require('mysql');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const mcpadc = require('mcp-spi-adc');
const app = express();
const CS_MCP3208 = 10;

// const TRIG = 29;
// const ECHO = 28;

const SPI_CHANNEL = 0;
const SPI_SPEED = 100000;

var sid;

// DB 관리 const 
const client = mysql.createConnection({
    host:'localhost',
    port:3306,
    user:'root',
    password:'gachon654321',
    database : 'sensordb'
});

const minLight = 1091

// LightDetect 생성
const LightDetect = () =>{
    lightsensor.read((error,reading)=>{
        console.log("▼ ▲ (%d)",reading.rawValue);
        if(reading.rawValue>minLight){
            console.log("기준값:(%d),아날로그 측정값(%d)",minLight,reading.rawValue);
            let stamptime = new Date();
            client.query('INSERT INTO light VALUES (?,?)',[stamptime,reading.rawValue],(err,result)=>{
                if(err){
                    console.log("DB저장실패");
                    console.log(err);
                }
                else console.log("DB저장완료");

            }); /* client.query*/     
        } // 필터링 기준값 이상크기이면, 출력
        
        else console.log("인식안함");
    });
    sid = setTimeout(LightDetect,800);  // 타임아웃 취소용 sid값저장
}

// LightSensor
const lightsensor = mcpadc.openMcp3208(SPI_CHANNEL,
    {speedHZ:SPI_SPEED},
    (err)=>{
        console.log("MCP-ADC 초기화!");
        if(err)console.log('ADC 초기화 실패!(HW점검!)');
    });
app.use(bodyParser.urlencoded({extended:false}));   // body parser 환경설정

app.get('/',(req,res)=>{
    console.log("sensor 호출");
    fs.readFile('sen_light.html','utf8',(error,data)=>{
        if(!error) res.send(data);

    });
});


app.get('/1',(req,res)=>{
    console.log("광센서 활성화 수행");
    sid = setTimeout(LightDetect,800); //활성화
    aid = setTimeout(Retrieve,3000);
    res.redirect('/');

});

app.get('/0',(req,res)=>{
    console.log("사운드센서 비활성화 수행");
    clearTimeout(sid);  // 타임아웃취소(비활성화)
    clearTimeout(aid);
    res.redirect('/');
});

process.on('SIGINT',function(){
    lightsensor.close(()=>{
        console.log("MCP-ADC가해제됩니다.");
        console.log("웹 서비스를 종료합니다.");
        process.exit();
    });
});

const Retrieve = function(){
    let stamp_distance;
    client.query('SELECT * FROM `light`',function(error,results,fields){
        console.log("-------------------------------------------");
        results.forEach(function(element,i){
            stamp_distance='';
            stamp_distance += element.stamp.toLocaleString('ko-KR',{hour12:false})+'.';
            stamp_distance += element.stamp.getMilliseconds() + ' ';
            stamp_distance += element.bright; // 거리(distance) 추가
            
            console.log(stamp_distance);
        });
        console.log("-------------------------------------------");
        setTimeout(Retrieve,5000);  // 5초마다 DB조회(저장확인)
    }); // client.query(...)
}
console.log("---측정중입니다.---");

app.listen(60001, () => {
    gpio.wiringPiSetup();
    gpio.pinMode(CS_MCP3208, gpio.OUTPUT);
    console.log("------------------------------------------------------");
    console.log("웹브라우저 접속주소 : http://192.9.114.204:60001/");
    console.log("------------------------------------------------------");
  });