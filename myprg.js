const gpio = require('node-wiring-pi');
const TOUCH = 23;
const BUZZER = 25;
const BLUE = 29;
const GREEN = 28;
const RED = 27;
const LIGHT = 7;

var count = 0;
let clock = null;
const CheckLight = function(){
    var data = gpio.digitalRead(LIGHT);

    if(!data){
        console.log("Nodejs:Brigt!!");
        gpio.digitalWrite(RED,0);
    }
    else{
        console.log("Nodejs: Dark..");
        gpio.digitalWrite(BLUE,0);
        gpio.digitalWrite(GREEN,0);
        gpio.digitalWrite(RED,1);
    }
    clock = setTimeout(CheckLight,300);
}

const CheckTouch = function(){
    var data = gpio.digitalRead(TOUCH);
    setTimeout(CheckTouch,300);
    if(data){

    switch(count){
        case 0:
            console.log("node touch! -- 1");
            gpio.digitalWrite(BUZZER,1);
            setTimeout(gpio.digitalWrite.bind(this,BUZZER,0),50);
            gpio.digitalWrite(BLUE,1);
            gpio.digitalWrite(GREEN,1);
            CheckLight();
            count++;
            break;
        case 1:
            console.log("node touch! -- 2");
            clearTimeout(clock);
            gpio.digitalWrite(BUZZER,1);
            setTimeout(gpio.digitalWrite.bind(this,BUZZER,0),80);
            gpio.digitalWrite(BLUE,0);
            gpio.digitalWrite(GREEN,0);
            count++;
            break;
        case 2:
            console.log("node touch! -- 3");
            gpio.digitalWrite(BUZZER,1);
            let point = true;
            let beepCount = 0;

            let clock = setInterval(()=>{
	       if(point === true) {
		   point = false;
		   gpio.digitalWrite(BUZZER,0);
		   beepCount += 1;
		   console.log(11);
	      } else {
		point = true;
		gpio.digitalWrite(BUZZER,1);
		if(beepCount === 2) {
			console.log(111111);
			gpio.digitalWrite(BUZZER,0);
			clearInterval(clock);
		}
	      }
             },10)
            count=0;
            break;
    }
}

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
gpio.pinMode(LIGHT,gpio.INPUT);
gpio.pinMode(TOUCH,gpio.INPUT);
gpio.pinMode(RED,gpio.OUTPUT);
gpio.pinMode(GREEN,gpio.OUTPUT);
gpio.pinMode(BLUE,gpio.OUTPUT);
gpio.pinMode(BUZZER,gpio.OUTPUT);



setTimeout(CheckTouch,10);