var requirejs=require("./public/requirejs/require");
var require=requirejs.require;
var jsonclient=require('../jsonrpcclient1');
var dgram = require('dgram');
var async = require("async");

var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

var xml2js=require('../xml2js/lib/xml2js');
var xmlparser=new xml2js.Parser();
var builder = new xml2js.Builder();
var getRPC =jsonclient.rpc;
//var HandlingJSONresult=jsonclient.HandlingJSONresult;
var HandlingJSONres=jsonclient.HandlingJSONres;

var PORT = 52222;
var HOST = '127.0.0.1';
var remote = {host:'127.0.0.1',port:52222};
client=null;

function udp_connect(){
    client = dgram.createSocket('udp4');
    
    client.on('message', function(msg, remote) {
        var data=msg.toString();
        data+='\n';
        console.log("udpclient << remote="+ remote.address + ':' + remote.port + '-' + msg.toString());
        if(data[0]=='{'||data[0]=='['){
            var responseobject=JSON.parse(data);
            if(responseobject.id!==undefined){
                console.log('Recieved Response data from Server:', responseobject);
                HandlingJSONres(responseobject);
            }else{
                console.log('Recieved indication data from Server:', responseobject.msg);   
        }
        }//받은데이터를 파싱하고 res로 처리
        //client.close();
    });
    client.on('error',function(err){        //있으나 마나 . 서버 측은 끊어진줄도 모르니까
        client=null;
        setTimeout(udp_connect,5000);
    });
}
udp_connect();
/*// 없어도 상관
client.on('listening', function() {
	var addr = client.address();
	console.log('UDP client listening port : ' + addr.port);
});
client.bind(53333);
*/
/*
var message = {CMD:"ADD", parameter:{a:1,b:2}}; //string. 
var jsonMsg = JSON.stringify(message)+'\n';
client.send(jsonMsg, 0, jsonMsg.length, PORT, HOST, function(err, bytes) {
	if (err) {
		console.log(err);
		throw err;
	}
	console.log('{UDP message sent!!!! }' + HOST + ':' + PORT);
    //client.close();
});*/
function writeData(socket, jsonMsg){
    console.log("udpclient>> remote="+ HOST + ':' + PORT + '-' + jsonMsg.toString());
    client.send(jsonMsg, 0, jsonMsg.length, PORT, HOST, function(err, bytes) {

        if (err) {
            console.log(err);
            throw err;
        }
        console.log('{UDP message sent!!!! }' + HOST + ':' + PORT);
        
        //client.close();
    });
}
var udpsocket=client;
function deletenewline(builddata){
    var newdata=builddata.replace(/\n/g,'');
    //var newdata1=newdata.replace(/\t/g,'');
    return newdata;
};    
/*
function writeLine(socket, datain){    //data에 개행을 붙여 처리
    console.log('writelinedata====',datain);
    writeData(socket,datain+'\n');
}
async.series([
    function(callback){
        var data=["SUBS","KANG","mm"];
        writeData(udpsocket,JSON.stringify(data));
        callback(null,data);
        setTimeout(function(){}, 3000);
    },
    function(callback){
        var data=["SEND","KANG","hello server"];
        writeData(udpsocket,JSON.stringify(data));
        callback(null,data);
    }
],function(error,results){
    console.log('Series return value all:',  results);
});*/
/*
var requestobject2 = {CMD:"ADDS", parameter:[12,20,30,40,50,60,70,80,901,100]}; 

var HobbitsRPC = getRPC("Hobbits",52222,function(rsvd,res){console.log("OperHobbits Result == ", res);});
HobbitsRPC.client=client;
var senddata = HobbitsRPC.makeObject(requestobject2,function(rsvd,res){
    console.log("ADDS Result == ", res);
});
writeData(HobbitsRPC.client,senddata);
var requestobject5 = [{CMD:"ADDS", parameter:[12,20,30,40,50,60,70,80,901,100]},{CMD:"MULS", parameter:[12,20,30,40,50,60,70,80,901,100]},{CMD:"-", parameter:{a:100,b:9.5}} ]
    HobbitsRPC.writeObject(HobbitsRPC.client, requestobject5,function(rsvd,res){
            console.log("ADDS and MULS Result == ", res);
        },null,writeLine); 
*/
var HobbitsRPC = getRPC("Hobbits",52222,function(rsvd,res){console.log("OperHobbits Result == ", res);});

function reqrpc(reqobj,callback){
    var sendobj = HobbitsRPC.makeObject(reqobj,function(rsvd,res){
        console.log("reqrpc Result == ", res);
        callback(null,res);
    });
    writeData(udpsocket,JSON.stringify(sendobj));
}

function reqxmlrpc(reqobj,callback){
    var sendobj = HobbitsRPC.makeObject(reqobj,function(rsvd,res){
        console.log("reqrpc Result == ", res);
        callback(null,res);
    });
    writeData(udpsocket,deletenewline(builder.buildObject(sendobj)));
}    
function reqrpc2(callback,cmd,parameter){
    if(parameter==undefined)parameter=[];
    var reqobj={CMD:cmd, parameter:parameter};
    reqrpc(reqobj,callback);
}

async.series([
    function(callback){
        reqxmlrpc({CMD:"JAC", parameter:["KANG","kkk"]},function(rsvd,res){
            console.log("JAC Result == ", res);
            callback(null,res);
        });
    },
    function(callback){
        var requestobject2 = {CMD:"JIC", parameter:["KANG","hello i'm udp"]}; 

        var senddata = JSON.stringify(HobbitsRPC.makeObject(requestobject2,function(rsvd,res){
            console.log("JIC Result == ", res);callback(null,res);
        }));   ///보낼때 인코딩 //
        writeData(udpsocket,senddata);
        /*reqxmlrpc({CMD:"JIC", parameter:["KANG","hello i'm udp"]},function(rsvd,res){
            console.log("JiC Result == ", res);
            callback(null,res);
        });*/
    }
],function(error,results){
    console.log('Series return value all:',  results);
    
});
var prefix = 'udp >';
rl.on('line', function(cmd) {
    if(cmd=='quit'){rl.close();return;}
    //console.log('UDP message >> : ',cmd);
    rl.setPrompt(prefix, prefix.length);
        reqxmlrpc({CMD:"JIC", parameter:["KANG",cmd]},function(rsvd,res){
            console.log("JiC Result == ", res);
  });
});
rl.on('close', function() {// only gets triggered by ^C or ^D
    console.log('UDP Connect is end')
    var requestobject2 = {CMD:"JRC", parameter:["KANG","kkk"]}; 

    var senddata = JSON.stringify(HobbitsRPC.makeObject(requestobject2,function(rsvd,res){
    }));
    writeData(udpsocket,senddata);
    setTimeout(rlclose,3000);
});
function rlclose(){
    console.log('Good-bye udp');
    client.close();client=null;
    process.exit(0);
}