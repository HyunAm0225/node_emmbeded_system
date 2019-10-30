const gpio = require('node-wiring-pi');
const mysql = require('mysql');
const TRIG = 29;
const ECHO = 28;


var startTime;  // 초음파 송출시간
var travelTime; // 초음파 수신까지 경과시간

const client = mysql.createConnection({
    host:'localhost',
    port:3306,
    user:'root',
    password:'gachon654321',
    database : 'sensordb'
});

const Triggering = function(){
    gpio.digitalWrite(TRIG,gpio.LOW);
    gpio.delayMicroseconds(2);
    gpio.digitalWrite(TRIG,gpio.HIGH);
    gpio.delayMicroseconds(20);
    gpio.digitalWrite(TRIG,gpio.LOW);

    while(gpio.digitalRead(ECHO)==gpio.LOW);
    startTime = gpio.micros();
    while(gpio.digitalRead(ECHO)==gpio.HIGH);
    travelTime = gpio.micros() - startTime;
    distance = travelTime / 58;
    if(distance < 400){
        console.log("Distance:%d cm",distance);
        if(distance <= 20){
            let stamptime = new Date();
            client.query('INSERT INTO sonic VALUES (?,?)',[stamptime,distance],(err,result)=>{
                if(err){
                    console.log("DB저장실패");
                    console.log(err);
                }
                else console.log("DB저장완료");

            }); /* client.query*/
        }
    }
    setTimeout(Triggering,700);
}

const Retrieve = function(){
    let stamp_distance;
    client.query('SELECT * FROM `sonic`',function(error,results,fields){
        console.log("-------------------------------------------");
        results.forEach(function(element,i){
            stamp_distance='';
            stamp_distance += element.stamp.toLocaleString('ko-KR',{hour12:false})+'.';
            stamp_distance += element.stamp.getMilliseconds() + ' ';
            stamp_distance += element.distance; // 거리(distance) 추가
            
            console.log(stamp_distance);
        });
        console.log("-------------------------------------------");
        setTimeout(Retrieve,5000);  // 5초마다 DB조회(저장확인)
    }); // client.query(...)
}
console.log("---측정중입니다.---");
gpio.wiringPiSetup();
gpio.pinMode(TRIG,gpio.OUTPUT);
gpio.pinMode(ECHO,gpio.INPUT);
setImmediate(Triggering);
setImmediate(Retrieve);