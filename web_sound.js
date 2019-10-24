const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const gpio = require('node-wiring-pi');
const mcpadc = require('mcp-spi-adc');

const CS_MCP3208 = 10;
const SPI_CHANNEL = 0
const SPI_SPEED = 100000
var QuietSound = 1997;
var sid;

const soundsensor = mcdpadc.openMcp3208(SPI_CHANNEL,
    {speedHZ:SPI_SPEED},
    (err)=>{
        console.log("MCP-ADC 초기화!");
        if(err)console.log('ADC 초기화 실패!(HW점검!)');
    });
app.use(bodyParser.urlencoded({extended:false}));   // body parser 환경설정

app.get('/',(req,res)=>{
    console.log("sensor 호출");
    fs.readFile('sen.html','utf8',(error,data)=>{
        if(!error) res.send(data);

    });
});