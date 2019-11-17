const gpio = require('node-wiring-pi');
const DT = 29;
const CLK = 28;
var rotate = 0;

var data = {
    actid:'LED3',
    redcolor:'OFF',
    greencolor:'OFF',
    bluecolor:'OFF',
    whitecolor:'OFF'
};
const SenseRotate = ()=>{
    var checked = 0;
    // 오른쪽 핀(DT)가 먼저 접점이 떨어질 경우
    while(gpio.digitalRead(DT)==0){
        //rotate값을 1 추가 한 후,
        if(checked == 0){
            rotate ++;
            checked ++;
            console.log(rotate);
        }
        // 이후 감지되는 과정을 모두 무시한다.
        while(gpio.digitalRead(CLK)==0){}
    }
    
    // 왼쪽으로 돌릴 시 CLK를 기준으로 수행
    while(gpio.digitalRead(CLK)==0){
        if(checked == 0){
            rotate--;
            checked++;
            console.log(rotate);
        }
        while(gpio.digitalRead(DT)==0){}
    }
    LedControl(rotate);
    setTimeout(SenseRotate,20);
}
process.on('SIGINT',()=>{
    console.log("Program Exit...");
    process.exit();
});

const request = require('request');
LedControl = (rotate)=>{
// 여기서 다룬다
if(rotate==0){
    data = {
        actid:'OFF'
    };
}
else if(rotate==1){
    data = {
        actid:'LED3',
        redcolor:'ON',
    };
}
else if(rotate==2){
    data = {
        actid:'LED3',
        greencolor:'ON',
    };
}
else if(rotate==3){
    data = {
        actid:'LED3',
        bluecolor:'ON',
    };
}
else if(rotate==4){
    data = {
        actid:'LED3',
        whitecolor:'ON'
    };
}
else if(rotate>5||rotate<0){
    data = {
        actid:'OFF'
    };
}

request.put(
    {url:'http://192.9.112.48:60004/led',
    form:data,
    headers:{"content-type":"application/x-www-form-urlencoded"}},
    function(error,response,body){
        if(!error&&response.statusCode == 200){
            console.log(body);
        }
    }
);

}

gpio.wiringPiSetup();
gpio.pinMode(DT,gpio.INPUT);
gpio.pinMode(CLK,gpio.INPUT);
setImmediate(SenseRotate)
    