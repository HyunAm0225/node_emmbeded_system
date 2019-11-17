const gpio = require('node-wiring-pi');
const DT = 29;
const CLK = 28;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const GREEN = 21;
const RED = 22;
const BLUE = 23;

var rotate = 0;

app.use(bodyParser.urlencoded({extended:false}));

var mydata = {
    acid:'LED3',
    redcolor:'OFF',
    greencolor:'OFF',
    bluecolor:'OFF',
    whitecolor:'OFF'
};

// const SenseRotate = ()=>{
//     var checked = 0;
//     // 오른쪽 핀(DT)가 먼저 접점이 떨어질 경우
//     while(gpio.digitalRead(DT)==0){
//         //rotate값을 1 추가 한 후,
//         if(checked == 0){
//             rotate ++;
//             checked ++;
//             console.log(rotate);
//         }
//         // 이후 감지되는 과정을 모두 무시한다.
//     }
//     while(gpio.digitalRead(CLK)==0){}
//     // 왼쪽으로 돌릴 시 CLK를 기준으로 수행
//     while(gpio.digitalRead(CLK)==0){
//         if(checked == 0){
//             rotate--;
//             checked++;
//             console.log(rotate);
//         }
//         while(gpio.digitalRead(DT)==0){}
//     }
//     setTimeout(SenseRotate,20);
// }
process.on('SIGINT',()=>{
    console.log("Program Exit...");
    gpio.digitalWrite(RED,0);
    gpio.digitalWrite(GREEN,0);
    gpio.digitalWrite(BLUE,0);
    process.exit();
});

const led3control = (req,res)=>{
    console.log("PUT method로 데이터수신...");
    if(req.body.actid == 'LED3'){
        if(req.body.redcolor =='ON'){
            gpio.digitalWrite(RED,1);
            gpio.digitalWrite(BLUE,0);
            gpio.digitalWrite(GREEN,0);
            console.log("빨강LED켰음");
        }
        if(req.body.greencolor =='ON'){
            gpio.digitalWrite(RED,0);
            gpio.digitalWrite(BLUE,0);
            gpio.digitalWrite(GREEN,1);
            console.log("초록LED켰음");
        }
        if(req.body.bluecolor=='ON'){
            gpio.digitalWrite(RED,0);
            gpio.digitalWrite(BLUE,1);
            gpio.digitalWrite(GREEN,0);
            console.log("파랑LED켰음");
        
        }
        if(req.body.whitecolor=='ON'){
            gpio.digitalWrite(RED,1);
            gpio.digitalWrite(BLUE,1);
            gpio.digitalWRite(GREEN,1);
            console.log("흰색LED켰음");
        }
        res.send("OK");
    }
    else if(req.body.actid=='OFF'){
        gpio.digitalWrite(RED,0);
            gpio.digitalWrite(BLUE,0);
            gpio.digitalWRite(GREEN,0);
            console.log("OFF");
    }

    else res.send("FAIL");
}

app.put('/led',led3control);
app.get('/led',(req,res)=>{
    console.log("Get method");
});

app.listen(60004,()=>{
    console.log('SVR_LED.js: 서버(60001)가동중...');
    gpio.wiringPiSetup();
    // setImmediate(SenseRotate);
    gpio.pinMode(BLUE,gpio.OUTPUT);
    gpio.pinMode(RED,gpio.OUTPUT);
    gpio.pinMode(GREEN,gpio.OUTPUT);
    gpio.pinMode(DT,gpio.INPUT);
    gpio.pinMode(CLK,gpio.INPUT);
});
    