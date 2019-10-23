const gpio = require('node-wiring-pi');
const BUTTON = 29;
const LIGHT = 28;
const TOUCH = 21;
const BUZZER = 26;
const RED = 23;
const GREEN = 24;
const BLUE = 27;
const RELAY = 25;
const btnCount = 0;

let clock = null;

// const TurnOn = function () {
//   gpio.digitalWrite(RELAY, gpio.HIGH);
//   setTimeout(TurnOff, 3000);
// }

// const TurnOff = function () {
//   gpio.digitalWrite(RELAY, gpio.LOW);
//   setTimeout(TurnOn, 3000);
// }

const CheckTouch = function () {
  var data = gpio.digitalRead(TOUCH);
  if( data ) {
    gpio.digitalWrite(RED,1);
    setTimeout(gpio.digitalWrite.bind(this,RED,0), 200);
  }
  setTimeout(CheckTouch, 3000);
}

const CheckLight = function () {
  var data = gpio.digitalRead(LIGHT);
  if (! data) {
    gpio.digitalWrite(RELAY, gpio.HIGH);
    console.log("Nodejs:Brigt!!");
    // TurnOff();
  } else {
    gpio.digitalWrite(RELAY, gpio.LOW);
    console.log("Nodejs: Dark..");
    // TurnOn();
  }
  clock = setTimeout(CheckLight,300);
}


const CheckButton = function () {
  let data = gpio.digitalRead(BUTTON);
  if (!data) {
      console.log("button!!");
    switch ( btnCount) {
      
      case 0:
        console.log(btnCount);
        btnCount ++;
        gpio.digitalWrite(BUZZER,1);
        setTimeout(gpio.digitalWrite.bind(this,BUZZER,0),100);
        // setTimeout(TurnOnBuzzer,100);
        gpio.digitalWrite(RED,1);
        gpio.digitalWrite(GREEN,1);
        gpio.digitalWrite(BLUE,1);
        CheckLight();
        break;

      case 1:
        clearTimeout(clock);
        console.log(btnCount);
        // setTimeout(TurnOnBuzzer, 100);
        gpio.digitalWrite(BUZZER,1);
        setTimeout(gpio.digitalWrite.bind(this,BUZZER,0),100);
        gpio.digitalWrite(RED,0);
        gpio.digitalWrite(GREEN,0);
        gpio.digitalWrite(BLUE,0);
        btnCount = 0;
        break;

      default:
        console.log(btnCount);
        console.log("pressed");
    }
  }
  setTimeout(CheckButton, 300);
}

// const TurnOnBuzzer = function () {
//   gpio.digitalWrite(BUZZER, 1);
//   setTimeout(TurnOffBuzzer, 1000);
// }
// const TurnOffBuzzer = function () {
//   gpio.digitalWrite(BUZZER, 1);
//   setTimeout(TurnOnBuzzer, 1000);
// }

process.on('SIGINT', function () {
  gpio.digitalWrite(RED,0);
  gpio.digitalWrite(GREEN,0);
  gpio.digitalWrite(BLUE,0);
  gpio.digitalWrite(BUZZER,0);
  gpio.digitalWrite(RELAY,0);
  console.log("exit");
  process.exit();
});

gpio.setup('wpi');
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(LIGHT, gpio.INPUT);
gpio.pinMode(TOUCH, gpio.INPUT);
gpio.pinMode(RELAY,gpio.OUTPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);

setTimeout(CheckTouch,100);
setImmediate(CheckButton);

