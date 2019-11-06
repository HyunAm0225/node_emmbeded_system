const express = require('express');
const app = express();

var mydata = {
    name:"홍길동",
    age:27,
    addr:"수원",
    tel:"010-999-9999"
};
var cnt;

const getmember = (req,res) =>{
    console.log("Server:GET(%d)> 데이터 보냄!",cnt++);
    res.send(mydata);
}
app.get('/member',getmember);

app.listen(60001,()=>{
    console.log('Peer1:server is activated on 60001');
});