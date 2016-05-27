var uart = require("serialport");
var fs=require('fs');

var option=require('./option.js');
option.loadconfig();

var delimiter='\n';

var processgroupmessage=null;
function sendall(message){
    processgroupmessage(null,null,["SEND","KANG",message]);
}
var serialsend;
function serialbridge ()
{
    var serialPort = new uart.SerialPort(valtable.serialbridgeport, {
        baudrate: 115200,
        parser: uart.parsers.readline(delimiter)
    });

    serialsend=function(callback,message){
        process.stdout.write("ssend :"+message);
        serialPort.write(message,function(err,results){
            console.log("write OK! results:",results);
            callback(null,[]);
        });           
    }

    serialPort.on("open", function(){
        console.log('open');
        //processserialdata('open');
        serialPort.on('data', function(data){
            process.stdout.write("srecv :"+data+delimiter);
            //processserialdata('data',data);
            //setTimeout(function(){processserialdata('data',data);},200);
            sendall(data+delimiter);
        });
    });
}
serialbridge();
exports.register = function(M_on){
    M_on("SSEND",serialsend);
};
exports.setbroadcastcallback = function(processgroupmessage_input){           //여기서 쓰겟다
    processgroupmessage=processgroupmessage_input;
};