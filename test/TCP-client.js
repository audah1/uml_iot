var requirejs=require("../server/public/requirejs/require");
//var require=requirejs.require;
var jsonclient=require('../server/public/jsonrpcclient1.js');
var net = require('net');
var async = require("async");
var reconnect=require('reconnect');

var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
var parsers = require("../server/public/parsers");

var xml2js=require('../server/public/xml2js/lib/xml2js');
var xmlparser=new xml2js.Parser();
var builder = new xml2js.Builder();
var HandlingJSONres=jsonclient.HandlingJSONres;
var getRPC =jsonclient.rpc;
//var HandlingJSONresult=jsonclient.HandlingJSONresult;

var delimiter="\n";

function makereqobj(CMD, param){
    var requestobject={};
    requestobject.CMD = CMD;
    requestobject.parameter = param;

    return requestobject;
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
function writeLine(socket, datain){    //data에 개행을 붙여 처리
    console.log('writelinedata====',datain);
    writeData(socket,datain+'\n');
}
var connName = "Hobbits";
var port=52222;
if(port == undefined)
{
    port = 8107;
}
console.log("??????",port);
var client=null;
function connect_tcp(){
    //try{
        client= net.connect({port: port, host:'localhost'}, function() {
            console.log(connName + ' Connected: ');
            console.log('   local = %s:%s', this.localAddress, this.localPort);
            console.log('   remote = %s:%s', this.remoteAddress, this.remotePort);
            this.setTimeout(500000);
            this.setEncoding('utf8');
            this.on('data', function(data) {
                var parser = parsers.readline(delimiter);
                //if(data[0]=='{'||data[0]=='[')HandlingJSONresult(data);
                parser({emit:function(message,data){
                    if(data[0]=='{'||data[0]=='['){
                        var responseobject = JSON.parse(data);
                        if(responseobject.id!==undefined){
                            console.log('Recieved Response data from Server:', responseobject);
                            HandlingJSONres(responseobject);
                        }else{
                            console.log('Recieved indication data from Server:', responseobject.msg);   
                        }
                    }else if(data.substring(0,2)=='<?'){
                        xmlparser.parseString(data,function(err, res){
                            HandlingJSONres(JSON.parse(res.root));
                        });
                    }
                }},data);
            });
            this.on('end', function() {
                console.log(connName + ' Client disconnected');
            });
            this.on('timeout', function() {
                console.log('Socket Timed Out');
            });
            this.on('close', function() {
                console.log('Socket Closed');
            });
            
            jsonrpctest(this);
        });
        console.log('tcp connect start');
        client.on('error', function(err) {
            console.log('Socket Error: ', JSON.stringify(err));
            client=null;
            setTimeout(connect_tcp,5000);
        });
    /*}
    catch(error){
        console.log('tcp connect error',error);
    }
    */
}
connect_tcp();
/*        
reconnect(function(stream){
    console.log('client reconnect');
}).connect(52222);

var HobbitsRPC = getRPC("Hobbits",52222,function(rsvd,res){console.log("OperHobbits Result == ", res);});
HobbitsRPC.client=client;
HobbitsRPC.writeObject(HobbitsRPC.client, requestobject2,function(rsvd,res){
    console.log("ADDS Result == ", res);
});
HobbitsRPC.writeObject(HobbitsRPC.client, {id:4, CMD:"DIV",  parameter:{a:10, b:20}},function(rsvd,res){
    console.log("DIV Result == ", res);
    HobbitsRPC.writeObject(HobbitsRPC.client, { CMD:"MULS", parameter:[12,20,30,40,800,60,70,80,901,100]}, function(rsvd,res){
        console.log("MULS Result == ", res);
    });
});
//var resultSYNC = HobbitsRPC.writeObjectSYNC(HobbitsRPC.client, {CMD:"DIV",  parameter:{a:25, b:400}});
    //console.log('SYNC RESULT===', resultSYNC);
async.parallel([
    function(callback){
        HobbitsRPC.writeObject(HobbitsRPC.client, makereqobj("MUL",{a:1,b:2}),function(rsvd,res){
            console.log("ADDS parallel Result == ", res);callback(rsvd,res);
        },null);
    },
    function(callback){
        HobbitsRPC.writeObject(HobbitsRPC.client, {id:4, CMD:"DIV",  parameter:{a:10, b:20}},function(rsvd,res){
            console.log("DIV Result == ", res);callback(rsvd,res);
        },null);
    },
    function(callback){
        HobbitsRPC.writeObject(HobbitsRPC.client, { CMD:"MULS", parameter:[12,20,30,40,800,60,70,80,901,100]}, function(rsvd,res){
            console.log("MULS Result == ", res);callback(rsvd,res);
        },null);
    }
],function(error,results){
    console.log('Parallel return value all:',  results);
});
var addresult;
async.series([
    function(callback){
        HobbitsRPC.writeObject(HobbitsRPC.client, requestobject2,function(rsvd,res){
            console.log("ADDS Result == ", res);
            addresult =res;
            callback(rsvd,res);
        },null);
    },
    function(callback){
        HobbitsRPC.writeObject(HobbitsRPC.client, {id:4, CMD:"DIV",  parameter:{a:addresult, b:20}},function(rsvd,res){
            console.log("DIV Result == ", res);callback(rsvd,res);
        },null);
    },
    function(callback){
        HobbitsRPC.writeObject(HobbitsRPC.client, { CMD:"MULS", parameter:[12,20,30,40,800,60,70,80,901,100]}, function(rsvd,res){
            console.log("MULS Result == ", res);callback(rsvd,res);
        },null);
    }
],function(error,results){
    console.log('Series return value all:',  results);
    
    var requestobject5 = [{CMD:"ADDS", parameter:[12,20,30,40,50,60,70,80,901,100]},{CMD:"MULS", parameter:[12,20,30,40,50,60,70,80,901,100]},{CMD:"-", parameter:{a:100,b:9.5}} ]
    HobbitsRPC.writeObject(HobbitsRPC.client, requestobject5,function(rsvd,res){
            console.log("ADDS and MULS Result == ", res);
        },null,writeLine);   
});
        
var senddata = HobbitsRPC.makeObject(requestobject2,function(rsvd,res){
    console.log("ADDS Result == ", res);
});
writeData(HobbitsRPC.client,senddata);
*/
function deletenewline(builddata){
    var newdata=builddata.replace(/\n/g,'');
    //var newdata1=newdata.replace(/\t/g,'');
    return newdata;
};    
function jsonrpctest(tcpsocket)
{
        /*
        async.series([
            function(callback){
                var data=["SUBS","KANG","MM"];
                writeData(tcpsocket,JSON.stringify(data));
                callback(null,data);
                setTimeout(function(){}, 3000);
            },
            function(callback){
                var data=["SEND","KANG","HELLO"];
                writeData(tcpsocket,JSON.stringify(data));
                callback(null,data);
            }
        ],function(error,results){
            console.log('Series return value all:',  results);
            
        });*/
    var HobbitsRPC = getRPC("Hobbits",52222,function(rsvd,res){console.log("OperHobbits Result == ", res);});
        
    function reqrpc(reqobj,callback){
        var sendobj = HobbitsRPC.makeObject(reqobj,function(rsvd,res){
            console.log("reqrpc Result == ", res);
            callback(null,res);
        });
        writeData(tcpsocket,JSON.stringify(sendobj)+delimiter);
    }

    function reqxmlrpc(reqobj,callback){
        var sendobj = HobbitsRPC.makeObject(reqobj,function(rsvd,res){
            console.log("reqrpc Result == ", res);
            callback(null,res);
        });
        writeData(tcpsocket,deletenewline(builder.buildObject(sendobj))+delimiter);
    }    
    function reqrpc2(callback,cmd,parameter){
        if(parameter==undefined)parameter=[];
        var reqobj={CMD:cmd, parameter:parameter};
        reqrpc(reqobj,callback);
    }
        
    async.series([
    function(callback){
        reqxmlrpc({CMD:"JAC", parameter:["KANG","myeongmo"]},function(rsvd,res){
            console.log("JAC Result == ", res);
            callback(null,res);
        });
    },
    function(callback){
        reqxmlrpc({CMD:"JIC", parameter:["KANG","hello i'm tcp"]},function(rsvd,res){
            console.log("JAC Result == ", res);
            callback(null,res);
        });
    }
    ],function(error,results){
    console.log('Series return value all:',  results);
    rl.prompt();
    });
    var prefix = 'tcp >';
    rl.setPrompt(prefix, prefix.length);
    rl.on('line', function(cmd) {// only gets triggered by ^C or ^D
        if(cmd=='quit'){client.destroy();client=null;rl.close();return;}
        //console.log('TCP message >> ',cmd);
        var requestobject2 = {CMD:"JIC", parameter:["KANG",""]};
            requestobject2.parameter[1]=cmd;
        var senddata = JSON.stringify(HobbitsRPC.makeObject(requestobject2,function(rsvd,res){
            }));
            writeData(tcpsocket,senddata+delimiter);
    
    //rl.setPrompt(prefix, prefix.length);
    //rl.prompt();
    });
    rl.on('close', function() {
    
    console.log('Good-bye tcp');
    if(client!=null)client.destroy();
    process.exit(0);
    });
}