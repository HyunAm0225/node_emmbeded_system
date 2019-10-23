const gpio = require('node-wiring-pi');
let BUZZER = 22;
let BLUE = 23;
let RED = 24;
let GREEN = 25;
let BUTTON = 29;
let count = 0;
let ledCount = 0;



const DetectButton = function () {
  switch (count) {
    case 0 :
        console.log("case :0",ledCount);
        if (ledCount === 0) {
          gpio.softPwmWrite(GREEN, 1);
        } else if (ledCount === 1) {
          gpio.softPwmWrite(GREEN, 25);
        } else if (ledCount === 2) {
          gpio.softPwmWrite(GREEN, 50);
        }else if (ledCount === 3) {
          gpio.softPwmWrite(GREEN, 75);
        } else if (ledCount === 4) {
          gpio.softPwmWrite(GREEN, 100);
          count++;
        }
        if ( ledCount === 5) {
        
        gpio.digitalWrite(BUZZER, 1);
        gpio.delay(50);
        gpio.digitalWrite(BUZZER, 0);
        
          ledCount = 0;
        } else {
          ledCount++;
        }
        break;
    case 1 :
        console.log("case : 1",ledCount);
        gpio.softPwmWrite(GREEN,0);
        if (ledCount === 0) {
          gpio.softPwmWrite(BLUE, 1);
        } else if (ledCount === 1) {
          gpio.softPwmWrite(BLUE, 25);
        } else if (ledCount === 2) {
          gpio.softPwmWrite(BLUE, 50);
        }else if (ledCount === 3) {
          gpio.softPwmWrite(BLUE, 75);
        } else if (ledCount === 4) {
          gpio.softPwmWrite(BLUE, 100);
          count++;
        }
        if ( ledCount === 5) {
          gpio.digitalWrite(BUZZER, 1);
          gpio.delay(50);
          gpio.digitalWrite(BUZZER, 0);
          
          ledCount = 0;
        } else {
          ledCount++;
        }
        break;
    case 2 :
        console.log("case : 2",ledCount);
        gpio.softPwmWrite(BLUE,0);
          if (ledCount === 0) {
            gpio.softPwmWrite(RED, 1);
          } else if (ledCount === 1) {
            gpio.softPwmWrite(RED, 25);
          } else if (ledCount === 2) {
            gpio.softPwmWrite(RED, 50);
          }else if (ledCount === 3) {
            gpio.softPwmWrite(RED, 75);
          } else if (ledCount === 4) {
            gpio.softPwmWrite(RED, 100);
            count++;
          }
          if ( ledCount === 5) {
            
            gpio.digitalWrite(BUZZER, 1);
            gpio.delay(50);
            gpio.digitalWrite(BUZZER, 0);
            
            ledCount = 0;
          } else {
            ledCount++;
          }
          break;
    case 3 :
        gpio.softPwmWrite(RED,0);
        console.log("case : 3",ledCount);
        if (ledCount === 0) {
          gpio.softPwmWrite(GREEN, 1);
          gpio.softPwmWrite(BLUE, 1);
          gpio.softPwmWrite(RED, 1);
        } else if (ledCount === 1) {
          gpio.softPwmWrite(GREEN, 25);
          gpio.softPwmWrite(BLUE, 25);
          gpio.softPwmWrite(RED, 25);
        } else if (ledCount === 2) {
          gpio.softPwmWrite(GREEN, 50);
          gpio.softPwmWrite(BLUE, 50);
          gpio.softPwmWrite(RED, 50);
        }else if (ledCount === 3) {
          gpio.softPwmWrite(GREEN, 75);
          gpio.softPwmWrite(BLUE, 75);
          gpio.softPwmWrite(RED, 75);
        } else if (ledCount === 4) {
          gpio.softPwmWrite(GREEN, 100);
          gpio.softPwmWrite(BLUE, 100);
          gpio.softPwmWrite(RED, 100);
          count++;
        }
        if ( ledCount === 5) {
          gpio.softPwmWrite(GREEN,0);
          gpio.softPwmWrite(BLUE,0);
          gpio.softPwmWrite(RED,0);  
          gpio.digitalWrite(BUZZER, 1);
          gpio.delay(50);
          gpio.digitalWrite(BUZZER, 0);
          ledCount = 0;

          
        } else {
          ledCount++;
        }
        break;
    case 4 :
        gpio.softPwmWrite(GREEN,0);
        gpio.softPwmWrite(BLUE,0);
        gpio.softPwmWrite(RED,0);
        gpio.digitalWrite(BUZZER, 1);
        gpio.delay(50);
        gpio.digitalWrite(BUZZER, 0);
        count = 0;
        ledCount = 0;
        break;
    default :
    console.log("default");
  }
}

process.on("SIGINT", function() {
  gpio.digitalWrite(BUZZER, 0);
  gpio.softPwmWrite(GREEN, 0);
  gpio.softPwmWrite(BLUE, 0);
  gpio.softPwmWrite(RED, 0);
  process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.pinMode(BLUE,gpio.OUTPUT);
gpio.pinMode(GREEN,gpio.OUTPUT);
gpio.pinMode(RED,gpio.OUTPUT);
gpio.wiringPiISR(BUTTON,gpio.INT_EDGE_RISING, DetectButton);


gpio.softPwmCreate(GREEN, 0, 100);
gpio.softPwmCreate(BLUE, 0, 100);
gpio.softPwmCreate(RED, 0, 100);