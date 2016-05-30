var jsonrpcserver =require('./jsonrpcserver');
var mathserver = require('./mathserver');
mathserver.register(jsonrpcserver.on);
var typechat = require('./typechat');
typechat.register(jsonrpcserver.onAsync);

var fs=require('fs');

var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

var option=require('./option.js');
option.loadconfig();
/*
        function getcontrols2(idtable){       //값저장
            var valtable={};
            for(var id in idtable)
            {
                valtable[id]=$('#'+id+'').val();
                //for(var id in idtable)
                //    if(valtable[id]==null)valtable[id]=idtable[id];
            }
            return valtable;
        }
        function setcontrols2(idtable,valtable){
            for(var id in idtable)
            {               
                $('#'+id+'').val(valtable[id]);
            }
        }*/

console.log("valtable :", valtable);
var prefix = valtable.prefix;
rl.setPrompt(prefix, prefix.length);

var selectMYSQL=valtable.mysql;
var selectSQlite=false;
var selectSQLITE=valtable.sqlite;
if(selectMYSQL){
    var dbserver = require('./db_orm');
    dbserver.connect2mysql ('Company','root','qwerty123');
    dbserver.register(jsonrpcserver.onAsync);
}
if(selectSQlite){
    var dbserver2 = require('./sqlite3');
    dbserver2.register(jsonrpcserver.onAsync);
}
if(selectSQLITE){
    var dbserver3 = require('./db_orm');
    dbserver3.register(jsonrpcserver.onAsync);
    /*dbserver3.getdata(function(err,result){
        console.log('getdata error>>>>>',err);
        console.log('getdata result', result);
    },'test','kang');*/
}
//function HandlingJSONLines(client, data) {
  //   console.log('DATA>>>>>>>>>>>>>>>>>>>>>>>>>',data);
    //var outdata = jsonrpcserver.HandlingJSONLines(client, data);
    //return outdata;
//}
if(valtable.tcp)var StartTCP = require('./TCPserver').StartTCP;
var socketServer = require('./socket-server');
if(valtable.udp)var udpserver =require('./udp-server');
if(valtable.udp)var UDPserver = udpserver.UDPserver;

var bDebug =false;
var writeDataAgain = true;
function writeData(socket, data)
{
    var success = !socket.write(data);
    if (!success&&writeDataAgain){
        if(bDebug)console.log('writedatafail==');
        writeDataAgain(socket, data);
    }
}
writeDataAgain=function(socket, data){
    socket.once('drain', function(){
        writeData(socket, data);
    });
};

function encodeforwardmsg(forwardingmessage){
    var forwardobj={type:'groupmessage',msg:forwardingmessage};
    return JSON.stringify(forwardobj);
};
function forwardmessage(error,conn,forwardingmessage){        //////////////     message send 
    var client =conn.data;
    //var forwardingmessage=message;
    
    console.log('type and data >>', conn.type, forwardingmessage );
    if(conn.type=="websocket")client.emit('groupmessage',forwardingmessage); //type에따른 처리
    else if(conn.type=="tcpsocket")writeData(client,encodeforwardmsg(forwardingmessage)+'\n');
    else if(conn.type=="serialsocket")client.write(encodeforwardmsg(forwardingmessage)+'\n');
    else{//conn.type=="udpsocket"
        var remote=client.remote;
        var UDPserver=client.UDPserver;
        var forwardingmessage1=encodeforwardmsg(forwardingmessage);
        UDPserver.send(forwardingmessage1, 0, forwardingmessage1.length,remote.port,remote.address,function(err, bytes) {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log('UDP message sent!!!! ' + remote.address + ':' + remote.port);
        });
    }
}
function modifyparameter(requestobject,client){
    typechat.modifyparameter(requestobject,client,forwardmessage);
}
function processgroupmessage(type,socket,data){
    //var data=[];
    var cmd=data[0], groupname=data[1], message=data[2];
    var conn={type:type,data:socket, name:message};
    //forwardingmessage=message;
    if(cmd=='SUBS')typechat.addclient(groupname,conn);//addclient  ex) group: kang ---> client:random <---
    else if(cmd=='UNS')typechat.removeclient(groupname,conn);
    else if(cmd=='UNSany')typechat.removeclientany(conn);
    else if(cmd=='SEND')typechat.iterateclientlist(groupname,forwardmessage,message);//같은 그룹 메시지 보내기        
}

rl.on('line', function(cmd) {// only gets triggered by ^C or ^D
    if(cmd=='quit'){
    typechat.iterateclientlist("KANG",forwardmessage,"Server close after 5 seconds");
    
    setTimeout(function(){process.exit(0)},5000);
        return;
    }
});
rl.on('close', function() {
    console.log('Good-bye server');
    process.exit(0);
});

if(valtable.udp)udpserver.setJsonCallback(jsonrpcserver.HandlingObjectAsync,processgroupmessage,modifyparameter/*,jsonrpcserver.HandlingObject,jsonrpcserver.HandlingJSONdataAsync,jsonrpcserver.HandlingJSONLinesAsync*/);
socketServer.setJsonCallback(jsonrpcserver.HandlingObjectAsync,processgroupmessage,modifyparameter/*,jsonrpcserver.HandlingObject,jsonrpcserver.HandlingJSONdataAsync,jsonrpcserver.HandlingJSONLinesAsync*/);
//var port;

if(valtable.tcp)StartTCP(52222,jsonrpcserver.HandlingObjectAsync,processgroupmessage,modifyparameter/*,jsonrpcserver.HandlingObject,jsonrpcserver.HandlingJSONdataAsync,jsonrpcserver.HandlingJSONLinesAsync*/);

if(valtable.serial)var serialserver = require('./serials_server');
if(valtable.serial)serialserver.setJSONcallback(jsonrpcserver.HandlingObjectAsync,processgroupmessage,modifyparameter);
if(valtable.serialbridge)var serialbridge = require('./serials_bridge');
if(valtable.serialbridge)serialbridge.register(jsonrpcserver.onAsync);

if(valtable.serialbridge)serialbridge.setbroadcastcallback(processgroupmessage);

if(valtable.tcpbridge)var tcpbridge = require('./tcp_bridge');
if(valtable.tcpbridge)tcpbridge.register(jsonrpcserver.onAsync);
if(valtable.tcpbridge)tcpbridge.setbroadcastcallback(processgroupmessage);

if(valtable.udpbridge)var udpbridge = require('./udp_bridge');
if(valtable.udpbridge)udpbridge.register(jsonrpcserver.onAsync);
if(valtable.udpbridge)udpbridge.setbroadcastcallback(processgroupmessage);

if(valtable.pingserver)var pingserver=require('./pingserver');
if(valtable.pingserver)pingserver.register(jsonrpcserver.onAsync);
if(valtable.pingserver)pingserver.setbroadcastcallback(processgroupmessage);

var getlogdata=require('./getlogdata');
getlogdata.register(jsonrpcserver.onAsync);