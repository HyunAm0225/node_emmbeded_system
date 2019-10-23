
/**
const http = require('http');
const gpio = require('node-wiring-pi');
const fs = require('fs');
const socketio = require('socket.io');
const LED = 26;
const BUZZER = 24;
const RED = 29;
const GREEN = 28;
const BLUE = 27;

const server = http.createServer(function(request,response){
    fs.readFile('web_ui.html','utf8',function(error,data){
        response.writeHead(200,{'Content-Type':'text/html'});
        response.end(data);
    });
}).listen(65001,function(){
    gpio.wiringPiSetup();
    gpio.pinMode(LED,gpio.OUTPUT);
    gpio.pinMode(RED,gpio.OUTPUT);
    gpio.pinMode(GREEN,gpio.OUTPUT);
    gpio.pinMode(BLUE,gpio.OUTPUT);
    gpio.pinMode(BUZZER,gpio.OUTPUT);
    gpio.digitalWrite(LED,0);
    console.log('werver running at http://129.9.114.197:65001')
});

const io = socketio.listen(server);
    io.sockets.on('connection',function(socket){

        socket.on('LED1',function(data){
            if(data===1){
                console.log("ledON");
                gpio.digitalWrite(LED,1);     
            }
            else gpio.digitalWrite(LED,0);
        });
        socket.on('Buzzer',function(data){
            if(data===1){
                console.log("BuzzerON");
                gpio.digitalWrite(BUZZER,1);     
            }
            else gpio.digitalWrite(BUZZER,0);
        });
        socket.on('r',function(data){
            if(data===1){
                console.log("REDON");
                gpio.digitalWrite(RED,1);     
            }
            else gpio.digitalWrite(RED,0);
        });
        socket.on('g',function(data){
            if(data===1){
                console.log("GREENON");
                gpio.digitalWrite(GREEN,1);     
            }
            else gpio.digitalWrite(GREEN,0);
        });
        socket.on('b',function(data){
            if(data===1){
                console.log("BLUENON");
                gpio.digitalWrite(BLUE,1);     
            }
            else gpio.digitalWrite(BLUE,0);
        });

        

    });
 */

const http = require("http");
const gpio = require("node-wiring-pi");
const fs = require("fs");
const socketio = require("socket.io");
const LED1 = 26;
const BUZZER = 24;
const RED = 29;
const GREEN = 28;
const BLUE = 27;
const server = http
  .createServer(function(request, response) {
    fs.readFile("nodeLED.html", "utf8", function(error, data) {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.end(data);
    });
  })
  .listen(65001, function() {
    gpio.wiringPiSetup();
    gpio.pinMode(LED1, gpio.OUTPUT);
    gpio.pinMode(RED, gpio.OUTPUT);
    gpio.pinMode(GREEN, gpio.OUTPUT);
    gpio.pinMode(BLUE, gpio.OUTPUT);
    gpio.pinMode(BUZZER, gpio.OUTPUT);
    gpio.digitalWrite(LED, 0);
    console.log("werver running at http://129.9.114.197:65001");
  });
const io = socketio.listen(server);
io.sockets.on("connection", function(socket) {
  socket.on("off", function(target) {
    toggle("off", target);
  });
  socket.on("on", function(target) {
    toggle("on", target);
  });
});

function toggle(state, target) {
  if (state === "off") {
    gpio.digitalWrite(target, 0);
  } else {
    gpio.digitalWrite(target, 1);
  }
}




    




