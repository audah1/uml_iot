var async = require("async");
var jsonclient=require('./public/jsonrpcclient1');
var HandlingJSONres=jsonclient.HandlingJSONres;
var getRPC =jsonclient.rpc;
var mkobj =jsonclient.mkobj;
//json서비스만 할수 있는 클라이언트
var uart = require("serialport");
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
var com ="com5";
var delimiter='\n';
var serialPort = new uart.SerialPort(com, {
    baudrate: 115200,
    parser: uart.parsers.readline(delimiter)
});
function reqrpc(requestobject2,callback){
    var reqobj=mkobj(requestobject2,callback,null);
        serialPort.write(JSON.stringify(reqobj)+delimiter,function(err,results){//단순 write와 콜백
        //console.log("write OK! results:",results);
    });
}
var prefix = 'serial '+com+'>';
rl.setPrompt(prefix, prefix.length);
//rl.prompt();
//serialPort.connect()
serialPort.on("open", function(){
    console.log('open');
    serialPort.on('data', function(data){
        var responseobject = (data);
        if(responseobject.id!==undefined){
            console.log('Recieved Response data from Server:', responseobject);
            HandlingJSONres(responseobject);
        }else{
            console.log('Recieved indication data from Server:', responseobject.msg);   
        }
        //console.log('response obj',JSON.parse(data));
        /*try{
        var res = HandlingJSONres(JSON.parse(data));
        
        }catch(err){
            //console.log('parsing err :', err);
            console.log('message :',data);
        }*/
    });
    var requestobject2 ={CMD:"JAC", parameter:["KANG","m_m"]};
    reqrpc(requestobject2,function(err, result){
        console.log('Result :', result);rl.prompt();
    });
});
rl.on('line', function(msg) {
    var requestobject2 = {CMD:"JIC", parameter:["KANG",""]}; 
    requestobject2.parameter[1]=msg;
    reqrpc(requestobject2,function(err, result){
        console.log('Result :', result);rl.prompt();
    });
});
rl.on('close', function() {
    console.log('Good-bye serial');
    process.exit(0);
});