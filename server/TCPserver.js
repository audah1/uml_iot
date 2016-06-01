var net = require('net');
var parsers = require("./public/parsers");

var HandlingObjectAsync = null;

var modifyparameter=null;
var processgroupmessage=null;

var xml2js=require('../node_modules/xml2js/lib/xml2js.js');
var xmlparser=new xml2js.Parser();
var builder = new xml2js.Builder();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//TCP
var bDebug=false;
var useBroadcast = false;
var debugClientList = false; 
var clientlist = [];

function HandlingObjectAsync1( client,partitionData,callback){
    var requestobjects=JSON.parse(partitionData);
    var outputdata='';
    if(modifyparameter!=null){
        var clientDATA={type:'tcpsocket',data:client,name:null};
            if(requestobjects.length==undefined)modifyparameter(requestobjects,clientDATA);
            else for(var i=0; i<requestobjects.length;i++) modifyparameter(requestobjects[i],clientDATA);   
    }
    HandlingObjectAsync( requestobjects,function(error, results){
        outputdata+=JSON.stringify(results);
        callback(error,outputdata);
    });
}
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

var TCPserver;

function clientHandler(client) {
    client.setTimeout(8000000);
    client.setEncoding('utf8');
    
    function deletenewline(builddata){
        var newdata=builddata.replace(/\n/g,'');
        //var newdata1=newdata.replace(/\t/g,'');
        return newdata;
    };
//socket.on('groupmessage', function(data){                     ////웹소켓 그룹 채팅
  //      processgroupmessage('websocket',socket,data);
    //});    
    var outputdata='';
    var parser = parsers.readline('\n');
    client.on('data', function(data) {
    //processgroupmessage('tcpsocket',client,JSON.parse(data));    
    /* HandlingJSONLinesAsync(client,data,function (error, results){
            writeData(client,results);      
    });*/
        if(data.substring(0,2)=="<?"){  //xml
            
            var parsingdata=xmlparser.parseString(data,function(err, res){
                HandlingObjectAsync1(client,JSON.stringify(res.root),function (error, results){
                    outputdata+=deletenewline(builder.buildObject(results))+'\n';
                });
            });
            if(outputdata.length>0){writeData(client,outputdata);outputdata='';}
        }    
        else if(data.substring(0,1)=='{'||data.substring(0,1)=='['){  //json
            parser({emit:function(message,partitiondata){
                HandlingObjectAsync1(client,partitiondata,function (error, results){outputdata+=results+'\n';});
            }},data);
            if(outputdata.length>0){writeData(client,outputdata);outputdata='';}
        }
        else parser({emit:function(message,partitiondata){outputdata+=partitiondata+'\n';}},data);  //plain
        /*HandlingJSONLinesAsync(data,function(error, results){ 
            try{
                writeData(client,results);
                if(bDebug)console.log('  Bytes sent: ' + client.bytesWritten);
            }catch(err){
                console.log('TCP send Error');
            }
        });*/  //json
        
    });
    client.on('end', function() {
        TCPserver.getConnections(function(err, count){
            if(bDebug)console.log('Remaining Connections: ' + count);
        });
        processgroupmessage('tcpsocket',client,['UNSany']);
    });
    client.on('error', function(err) {
        if(bDebug)console.log('Socket Error: ', JSON.stringify(err));
        //var clientDATA={type:'tcpsocket',data:client,name:null};
        //processgroupmessage('tcpsocket',client,['UNS','KANG','zpsodi']);
        processgroupmessage('tcpsocket',client,['UNSany']);
    });
    client.on('timeout', function() {
        if(bDebug)console.log('Socket Timed out');
    });
} 

  
var StartTCP = function(port,HandlingObjectAsync_input,processgroupmessage_input,modifyparameter_input/*,HandlingObject_input,HandlingJSONLinesinput,HandlingJSONdataAsync_input,HandlingJSONLineAsync_input*/)
{
    HandlingObjectAsync = HandlingObjectAsync_input;
    processgroupmessage=processgroupmessage_input;
    modifyparameter=modifyparameter_input;

    if(port == undefined){port = 8107;}    
    TCPserver = net.createServer(clientHandler);
    TCPserver.listen(port, function() {
        var server = TCPserver;
        console.log('<<TCP Server listening port : 52222>>');
        server.on('close', function(){
            if(bDebug)console.log('Server Terminated');
        });
        server.on('error', function(err){
            if(bDebug)console.log('Server Error: ', JSON.stringify(err));
        });
    });
}
exports.StartTCP = StartTCP;

/*
function addclient(client)
{
  clientlist.push(client);
  if(debugClientList)printclientlist();   
}
function removeclient(client)
{
    for(var i=0; i<clientlist.length; i++)
    {
        if(client==clientlist[i])
        {
            clientlist.splice(i,1);
            break;
        }
    }
    if(debugClientList)printclientlist();
}
function printclientlist()
{
    for(var i=0; i<clientlist.length; i++)
    {
        var client=clientlist[i];
        if(bDebug)console.log('client[%d] = %s:%s', i, client.remoteAddress , client.remotePort);
    }
}
function broadcastDataToClientList(data)
{
    for(var i=0; i<clientlist.length; i++)
    {
       var client=clientlist[i];
        writeData(client,data);                    ////모든 client에게 전달        
    }
}
function writeLine(socket, datain){    //data에 개행을 붙여 처리
   writeData(socket, datain+'\n');
}
function HandlingJSONLinesAsync(client,data,callback){
    var outputdata='';
    while(true){
        if(bDebug)console.log('>>>>',data);
        if(data!==undefined&&data!==null&&data.length!==undefined)
        if(data.length <= 0) break;
        var findCharPos = findCharacterPos(data);
        var partitionData = findCharPos<0? data:data.substring(0,findCharPos);
        var lastData=data.length-partitionData.length<3;
                
        if(data.substring(0,1) =='{'){
            var requestobjects=JSON.parse(partitionData);
            if(modifyparameter!=null){
                var clientDATA={type:'tcpsocket',data:client,name:null};
                    if(requestobjects.length==undefined)modifyparameter(requestobjects,clientDATA);
                    else for(var i=0; i<requestobjects.length;i++) modifyparameter(requestobjects[i],clientDATA);   
            }
            HandlingObjectAsync( requestobjects,function(error, results){
                outputdata+=JSON.stringify(results)+'\n';
                if(lastData)callback(error,outputdata);
            });
            if( findCharPos >= 0 ) data=data.substring(findCharPos+1);
            else break;
        }
        else if(data.substring(0,1) =='['){
            var requestobjects=JSON.parse(data);
            HandlingObjectAsync( requestobjects,function(error, results){
                outputdata+=JSON.stringify(results)+'\n';
                if(lastData)callback(error,outputdata);
            });
            if( findCharPos >= 0 ) data=data.substring(findCharPos+1);
            else break;
        }
    }
}

*/