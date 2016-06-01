var ping = require('../node_modules/ping/index');
var fs=require('fs');

var option=require('./option');
option.loadconfig();

var iphost=valtable.ping2;

var processgroupmessage=null;
function sendall(message){
    processgroupmessage(null,null,["SEND","KANG",message]);
}
function PING1(callback,iphost){
    ping.sys.probe(iphost, function(isAlive){
        var msg = isAlive ? 'host ' + iphost + ' is alive' : 'host ' + iphost + ' is dead';
        console.log("PING TEST RESULT :",msg);
        callback(null, isAlive);
        //if(pingres!=isAlive)callback(null, msg);
    });
}
function PING(callback,iphost){
    var pingres=null;
    ping.sys.probe(iphost, function(isAlive){
        var msg = isAlive ? 'host ' + iphost + ' is alive' : 'host ' + iphost + ' is dead';
        console.log("PING TEST RESULT :",msg);
        if(pingres!=isAlive)callback(null, isAlive);
        //if(pingres!=isAlive)callback(null, msg);
    });
}
function timingPING(callback,iphost){   //ping check 클릭시 핑 상태가 바뀌엇으면 출력/// 타임인자추가
    var pingres=null;
    function pingresultcheck_callback(err,res){
        if(pingres!=res){
            pingres=res;
            sendall("ping callback res :"+res);
        }
        setTimeout(Check_ping,10000);
    }
    function Check_ping(){
        console.log("start check ping :",iphost);
        PING(pingresultcheck_callback,iphost);
    }
    Check_ping();
    callback(null, "ping test start!!");
}
//PING();
function register(M_on){
    M_on("PING",PING);
    M_on("TSTPING",timingPING);
}

exports.register = register;
exports.PING=PING;
exports.setbroadcastcallback = function(processgroupmessage_input){           //여기서 쓰겟다
    processgroupmessage=processgroupmessage_input;
};