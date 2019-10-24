const fs = require('fs');
const http = require('http');
const gpio = require('node-wiring-pi');
const socketio = require('socket.io');
const mcpadc = require('mcp-spi-adc');

const CS_MCP3208 = 10;  // Chip Enable(CE0) is set
const VRX = 0;  // ADC 0번째 채널선택 = 아날로그센서
const VRY = 1;  // ADC 1번째 채널선택 = 아날로그센서
const SPI_SPEED = 1000000;  // Clock Speed = 1Mhz

var timerid, timeout = 800; // 타이머 제어용
var xvalue = yvalue = -1;   // JoyStic X,Y 측정데이터 저장용

const joyx = mcpadc.openMcp3208(VRX,    // 채널 0 지정(X좌표)))
    { speedHz : SPI_SPEED},     // Clock 속도 지정
    (err)=>{        // Callback 함수 등록
        console.log("SPI 채널 0 초기화 완료!");
        if(err)console.log("채널 0 초기화실패!(HW점검!)");
    });
const joyy = mcpadc.openMcp3208(VRY,    // 채널 1 지정(Y좌표)))
{ speedHz : SPI_SPEED},     // Clock 속도 지정
(err)=>{        // Callback 함수 등록
    console.log("SPI 채널 1 초기화 완료!");
    if(err)console.log("채널 1 초기화실패!(HW점검!)");
});

const JoyStick = () =>{
    joyx.read((error,reading)=>{
        console.log("▲ ▼(%d)",reading.rawValue);
        xvalue = reading.rawValue;
    });
    hoyy.read((error, reading)=>{
        console.log("         ◀ ▶ (%d)",reading.rawValue);
        yvalue = reading.rawValue;
    });
    if(xvalue != -1 && yvalue != -1){
        import.sockets.emit('watch',xvalue,yvalue);
        xvalue = yvalue = -1;
    }
    timerid = setTimeout(JoyStick, timeout);
}

process.on('SIGINT',()=>{
    joyx.close(()=>{
        joyy.close(()=>{
            console.log("MCP-ADC가 해제되어, 웹서버를 종료합니다");
            process.exit();
        });
    });
});

const serverbody = (request,response) =>{
    fs.readFile('views/plotly_joy.html','utf8',(err,data)=>{
        response.writeHead(200,{'Content-Type':'text/html'});
        response.end(data);
    });
};

const server = http.createServer(serverbody);
const io = socketio.listen(server);
io.sockets.on('connection',function(socket){
    socket.on('startmsg',function(data){
        console.log('가동메시지 수신(측정주기:%d!)',data);
        timeout = data;
        JoyStick();
    });
    socket.on('stopmsg',function(data){
        console.log('중지메시지 수신!');
        clearTimeout(timerid);
    });
});

server.listen(60001,()=>{
    gpio.wiringPiSetup();
    gpio.pinMode(CS_MCP3208,gpio.OUTPUT);
    console.log("□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□");
    console.log("조이스틱 제어용 웹서버");
    console.log("웹브라우저 접속주소 : http://192.9.112.215:60001/");
    console.log("□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□");
});