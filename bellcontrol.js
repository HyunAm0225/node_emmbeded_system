const gpio = require('node-wiring-pi');

const BLUE = 29;
const GREEN = 28;
const RED = 27;

const BUTTON = 25;
const BUZZER = 21;

var clock = null;
var started = false;

const ControlBell = function(){
    let data = gpio.digitalREAD(BUTTON);
    if(data){
            if(false === started){
                started = true;
                clock = setTimeout(handleButton,3000);
            }
        }
        else{
            gpio.digitalWrite(BLUE,1);
            console.log("Nodejs: BLUE On");
            setTimeout(TurnOffBlue,500);

            const TurnOffBlue = function(){
                gpio.digitalWrite(Blue,0);
                console.log("Nodejs: BLUE OFF");
            }
            started = false;
            clearTimeout(clock);
        }       
    }
const handleButton = function(){
    let data = gpio.digitalREAD(BUTTON)
    if(data){
        gpio.digitalWrite(BUZZER,1);
        console.log("Nodejs : Buzzer On");
        setTimeout(TurnOnRED,300);
        const TurnOnRED = function(){
            gpio.digitalWrite(BUZZER,0);
            gpio.digitalWrite(RED,1);
        }
    }
    
} 

process.on('SIGINT',function(){
    console.log("Program Exit...");
    process.exit();
});

gpio.setup('wpi');
gpio.pinMode(BUZZER,gpio.OUTPUT);
gpio.pinMode(RED,gpio.OUTPUT);
gpio.pinMode(BLUE,gpio.OUTPUT);
gpio.pinMode(GREEN,gpio.OUTPUT);
gpio.pinMode(BUTTON, gpio.INPUT);
setImmediate(ControlBell);
