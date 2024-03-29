const gpio = require('node-wiring-pi');
const BUTTON = 29;
const LED = 7;

const DetectButton = function(){
    gpio.digitalWrite(LED,1);
    gpio.delay(50);
    gpio.digitalWrite(LED,0);
}

process.on('SIGINT',function(){
    gpio.digitalWrite(LED,0);
    console.log("Program Exit...");
    process.exit();

});

gpio.wiringPiSetup();
gpio.pinMode(BUTTON,gpio.INPUT);
gpio.pinMode(LED,gpio.OUTPUT);
console.log("이벤트 방식 : 버튼을 누르면 LED가 켜집니다...");
gpio.wiringPiISR(BUTTON,gpio.INT_EDGE_RISING,DetectButton);