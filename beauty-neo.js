const ws281x = require('@bartando/rpi-ws281x-neopixel');
const NUM_LEDS = 16;

ws281x.init({count:NUM_LEDS, stripType:ws281x.WS2811_STRIP_GRB});
ws281x.setBrightness(30);

const waitTime = 200;
var offset = 0;
var colorrandom = Math.floor(Math.random()*256);

const LEDon = (color,max) =>{
    for(let i=0;i<max;i++){
        var t = max%2;
        if(t==0){
            if(i%2==0)
            ws281x.setPixelColor(i,color);
            else
            ws281x.setPixelColor(i,{r:0,g:0,b:0});
        }
        else if(t==1){
            if(i%2==1)
            ws281x.setPixelColor(i,color);
            else
            ws281x.setPixelColor(i,{r:0,g:0,b:0});
        }
        ws281x.show();
    }
}

process.on('SIGINT',function(){
    ws281x.reset();
    process.exit(0);
});

for(var i=0;i<NUM_LEDS;i++){
    
}



setInterval(()=>{

    if(offset ==0){
        LEDon({r:255,g:0,b:0},16);
        offset = 1;
        console.log('LED ON');
    }
    else if(offset ==1){
        LEDon({r:0,g:255,b:0},15);
        offset = 2;
        console.log('LED ON');
    }
    else if(offset ==2){
        LEDon({r:0,g:0,b:255},16);
        offset = 3;
        console.log('LED ON');
    } 
    else if(offset ==3){
        LEDon({r:255,g:255,b:255},15);
        offset = 0;
        console.log('LED ON');
    }

},waitTime);