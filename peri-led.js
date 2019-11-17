const gpio = require('node-wiring-pi');
const bleno = require('@abandonware/bleno');
const util = require('util');
const LED = 25;
var ledstate = 0;
var nodename = '3team-led';

var PrimaryService = bleno.PrimaryService;
var Characteristic = bleno.Characteristic;

var SwitchCharacteristic = function() {
    SwitchCharacteristic.super_.call(this,{
        uuid:'ff11',
        properties:['read','write'],
        descriptors:[
            new bleno.Descriptor({
                uuid:'2901',
                value:'Switch'
            })
        ]
    });
};

util.inherits(SwitchCharacteristic,Characteristic);

// central 기기에서 read request를 하면 peripheral 에서 이 함수가 실행됨
SwitchCharacteristic.prototype.onReadRequest=(offset,callback)=>{
    var data = Buffer.alloc(1);
    console.log('read request');
    data[0] = ledstate;
    callback(this.RESULT_SUCCESS,data);

};
// central 기기에서 write request를 하면 peripheral 에서 이 함수가 실행됨
SwitchCharacteristic.prototype.onWriteRequest = 
    (data,offset,withoutResponse,callback)=>{
        if(data[0]){
            console.log("블루투스>데이터수신:" + data.toString('hex') + '(LED ON)');
            gpio.digitalWrite(LED,1);
            ledstate = 1;
        }
        else{
            ledstate = 0;
            console.log("블루투스>데이터수신 : "+data.toString('hex')+'(LED OFF)');
            gpio.digitalWrite(LED,0);
        }
        callback(this.RESULT_SUCCESS); // central 기기로 응답(성공)을 전송
    };

var lightService = new PrimaryService({
    uuid:'ff10',
    Characteristics:[
        new SwitchCharacteristic()
    ]
});
bleno.on('stateChange',(state)=>{
    if(state === 'poweredOn'){
        bleno.startAdvertising(nodename,[lightService.uuid]);
        console.log("---------------------------");
        console.log("블루투스 >ON ("+nodename+"가동)");
    }
    else{
        bleno.stopAdvertising();
        console.log("블루투스>Advertising 을 중단합니다.");
    }
});
bleno.on('advertisingStart',(error)=>{
    if(!error){
        console.log("블루투스>Advertising 을 시작합니다...");
        console.log("-----------------------------------");
        bleno.setServices([lightService]);
    }
    else
        console.log("블루투스>Advertising 도중 오류 발생");

});
exit = () =>{
    console.log("블루투스>프로그램을 종료합니다.");
    process.exit();
}

process.on('SIGINT',exit);
gpio.wiringPiSetup();
gpio.pinMode(LED,gpio.OUTPUT);