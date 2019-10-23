const gpio = require('node-wiring-pi');

const BUTTON = 29;
const BLUE = 23;
const RED = 24;
const GREEN = 25;
const BUZZER = 22;
let btn_count = 0;
let led_count = 0;

const NextColor = function(){
    gpio.digitalWrite(BUZZER,1);
    gpio.delay(50);
    gpio.digitalWrite(BUZZER,0);
    btn_count++;
    led_count = 0;
}


const DetectButton = function(){
    switch(btn_count){
        case 0:
            if(led_count === 0) gpio.softPwmWrite(GREEN,1);
            else if(led_count === 1) gpio.softPwmWrite(GREEN,25);
            else if(led_count === 2) gpio.softPwmWrite(GREEN,50);
            else if(led_count === 3) gpio.softPwmWrite(GREEN,75);
            else if(led_count === 4) gpio.softPwmWrite(GREEN,100);
            else {
                NextColor();
            }   
            led_count++;
            break;
        case 1:
            gpio.softPwmWrite(GREEN,0);
            if(led_count === 0) gpio.softPwmWrite(BLUE,1);
            else if(led_count === 1) gpio.softPwmWrite(BLUE,25);
            else if(led_count === 2) gpio.softPwmWrite(BLUE,50);
            else if(led_count === 3) gpio.softPwmWrite(BLUE,75);
            else if(led_count === 4) gpio.softPwmWrite(BLUE,100);
            else {
                NextColor();
            }
            led_count++;
            break;
        case 2:
            gpio.softPwmWrite(BLUE,0);
            if(led_count === 0) gpio.softPwmWrite(RED,1);
            else if(led_count === 1) gpio.softPwmWrite(RED,25);
            else if(led_count === 2) gpio.softPwmWrite(RED,50);
            else if(led_count === 3) gpio.softPwmWrite(RED,75);
            else if(led_count === 4) gpio.softPwmWrite(RED,100);
            else {
                NextColor();
            }
            led_count++;
            break;
        case 3:
            gpio.softPwmWrite(RED,0);
            if(led_count === 0){
                gpio.softPwmWrite(RED,1);
                gpio.softPwmWrite(GREEN,1);
                gpio.softPwmWrite(BLUE,1);
            }
            else if(led_count === 1){
                gpio.softPwmWrite(RED,25);
                gpio.softPwmWrite(GREEN,25);
                gpio.softPwmWrite(BLUE,25);      
            }
            else if(led_count === 2){
                gpio.softPwmWrite(RED,50);
                gpio.softPwmWrite(GREEN,50);
                gpio.softPwmWrite(BLUE,50);    
            }
            else if(led_count === 3){
                gpio.softPwmWrite(RED,75);
                gpio.softPwmWrite(GREEN,75);
                gpio.softPwmWrite(BLUE,75);
            }
            else if(led_count === 4){
                gpio.softPwmWrite(RED,100);
                gpio.softPwmWrite(GREEN,100);
                gpio.softPwmWrite(BLUE,100);
            }
            else {
                NextColor();
            }
            led_count++;
            break;
        case 4:
            gpio.softPwmWrite(GREEN,0);
            gpio.softPwmWrite(BLUE,0);
            gpio.softPwmWrite(RED,0);
            btn_count = 0;
            break;
        default:
            break;
    }
}
process.on('SIGINT',function(){
    gpio.softPwmWrite(RED,0);
    gpio.softPwmWrite(GREEN,0);
    gpio.softPwmWrite(BLUE,0);
    gpio.digitalWrite(BUZZER,0);
    console.log("프로그램을 종료합니다.");
    process.exit();
});
gpio.wiringPiSetup();
gpio.pinMode(BLUE,gpio.OUTPUT);
gpio.pinMode(RED,gpio.OUTPUT);
gpio.pinMode(GREEN,gpio.OUTPUT);
gpio.pinMode(BUZZER,gpio.OUTPUT);
gpio.pinMode(BUTTON,gpio.INPUT)
console.log("이벤트 방식 : 버튼을 누르면 LED가 켜집니다...");
gpio.wiringPiISR(BUTTON,gpio.INT_EDGE_RISING,DetectButton);
gpio.softPwmCreate(BLUE, 0,100);
gpio.softPwmCreate(RED, 0,100);
gpio.softPwmCreate(GREEN, 0,100);