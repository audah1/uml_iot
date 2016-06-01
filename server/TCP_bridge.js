var net = require('net');
var fs=require('fs');
var parsers = require("./public/parsers");
var delimiter='\n';

var option=require('./option.js');
option.loadconfig();

var processgroupmessage=null;
function sendall(message){
    processgroupmessage(null,null,["SEND","KANG",message]);
}
function writeData(socket, datain){
    var data = datain;//+'\n';
    var success = !socket.write(data);
    if (!success){
        (function(socket, data){
            socket.once('drain', function(){
            writeData(socket, data);
            });
        })(socket,data);
    }   
}

var tcpsend;
var port=52222;

var outputdata='';
var client=null;
function tcpbridge(){
    client= net.connect({port: port, host:'localhost'}, function() {
        this.setEncoding('utf8');
        this.on('data', function(data) {
            var parser = parsers.readline(delimiter);
                //if(data[0]=='{'||data[0]=='[')HandlingJSONresult(data);
            parser({emit:function(message,partitiondata){outputdata+=partitiondata+'\n';}},data);
            sendall(data+delimiter);
        });
    });
    tcpsend=function(callback,message){
        process.stdout.write("tsend :"+message);
        sendall(message);
        writeData(client,message+delimiter);
    };
};
tcpbridge();
exports.register = function(M_on){
    M_on("TSEND",tcpsend);
};
exports.setbroadcastcallback = function(processgroupmessage_input){           //여기서 쓰겟다
    processgroupmessage=processgroupmessage_input;
};