const gpio = require('node-wiring-pi');
const ws281x = require('@bartando/rpi-ws281x-neopixel');
const mysql = require('mysql');
const NUM_LEDS = 16;
const TRIG = 29;
const ECHO = 28;

var startTime;  // 초음파 송출시간
var travelTime; // 초음파 수신 까지 경과 시간

ws281x.init({count:NUM_LEDS,stripType:ws281x.WS2811_STRIP_GRB});
ws281x.setBrightness(10);

const client = mysql.createConnection({
    host:'localhost',
    port:3306,
    user:'root',
    password:'gachon654321',
    database : 'sensordb'
});

const LEDon = (color,max) => {
    for(let i=0;i<max;i++){
        ws281x.setPixelColor(i,color);
        ws281x.show();
        gpio.delay(1);
    }
}

const saveDB = (distance)=>{
    client.query('INSERT INTO neosonic VALUES (?)',[distance],(err,result)=>{
        if(err){
            console.log("DB저장실패");
            console.log(err);
        }
        else console.log("DB저장완료");
    });
}



const Triggering = () =>{
    gpio.digitalWrite(TRIG,gpio.LOW);
    gpio.delayMicroseconds(2);
    gpio.digitalWrite(TRIG,gpio.HIGH);
    gpio.delayMicroseconds(20);
    gpio.digitalWrite(TRIG,gpio.LOW);
    while(gpio.digitalRead(ECHO)==gpio.LOW);
    startTime=gpio.micros();
    while(gpio.digitalRead(ECHO)==gpio.HIGH);
    travelTime = gpio.micros() - startTime;
    distance = travelTime / 58;

    if(distance < 40){
        console.log("근접거리:%i cm",distance);
        if(distance>0&&distance<5){
            LEDon({r:180,g:0,b:0},16);
            saveDB(distance);
        }  
        else if(distance>5&&distance<10) {
            LEDon({r:180,g:0,b:0},13);
            saveDB(distance);
        } 
        else if(distance>10&&distance<20) {
            LEDon({r:180,g:0,b:0},10);
            saveDB(distance);
        } 
        else if(distance>20&&distance<30) {
            LEDon({r:180,g:0,b:0},6);
        } 
        else if(distance>25&&distance<50) {
            LEDon({r:180,g:0,b:0},1);
        } 
    }
    LEDon({r:0,g:0,b:0},16);
    setTimeout(Triggering,100)
}

process.on('SIGINT',()=>{
    console.log("Program Exit...");
    ws281x.reset();
    process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(TRIG,gpio.OUTPUT);
gpio.pinMode(ECHO,gpio.INPUT);
setImmediate(Triggering);