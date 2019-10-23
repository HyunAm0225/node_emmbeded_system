const gpio = require('node-wiring-pi');
const BUZZER = 24;
const BLUE = 29;
const RED = 28;
const GREEN = 27;
let count = 0;
const BUTTON = 25;
const toggle = function(color){
    gpio.digitalWrite(color,1);
    gpio.digitalWrite(BUZZER,1);
    setTimeout(gpio.digitalWrite.bind(this,color,0),800);
    setTimeout(gpio.digitalWrite.bind(this,BUZZER,0),800);
}
const afterCheckBtnTargetEmit = function(){
    switch(count){
        case 0:
            toggle(BLUE);
            count++;
            break;
        case 1:
            toggle(RED);
            count++;
            break;
        case 2:
            toggle(GREEN);
            count = 0;
            break;
    }
}
const CheckButton = function(){
    let data = gpio.digitalRead(BUTTON);
    if(!data) afterCheckBtnTargetEmit();
    setTimeout(CheckButton,300);

}
process.on('SIGINT',function(){
    gpio.digitalWrite(BLUE,0);
    gpio.digitalWrite(GREEN,0);
    gpio.digitalWrite(RED,0);
    gpio.digitalWrite(BUZZER,0);
    console.log("exit");
    process.exit();
});

gpio.setup('wpi');
gpio.pinMode(BUZZER,gpio.OUTPUT);
gpio.pinMode(BLUE,gpio.OUTPUT);
gpio.pinMode(GREEN,gpio.OUTPUT);
gpio.pinMode(RED,gpio.OUTPUT);
gpio.pinMode(BUTTON,gpio.INPUT);
setImmediate(CheckButton);

