var dgram = require('dgram');
//var HandlingObject = null;
//var HandlingJSONLines =null;//jsonrpcserver.HandlingJSONLines;
var HandlingObjectAsync = null;
//var HandlingJSONLinesAsync = null;
//var HandlingJSONdataAsync=null;
var modifyparameterfunc=null;
var processgroupmessage=null;
var boolean=false;
var xml2js=require('./public/xml2js/lib/xml2js.js');
var xmlparser=new xml2js.Parser();
var builder = new xml2js.Builder();
//var jsonrpcserver =require('./jsonrpcserver');

//var mathserver = require('./mathserver');
//mathserver.register(jsonrpcserver.on);

var UDPserver = dgram.createSocket('udp4');
UDPserver.on('listening', function() {
	var addr = UDPserver.address();
	console.log('UDP Server listening port : ' + addr.port);
});
UDPserver.bind(52222);
UDPserver.on('message', function(message, remote){
    var msgstring=message.toString();
    function udpsend(results,remote){
         try{
            UDPserver.send(results, 0, results.length,remote.port,remote.address,function(err, bytes) {
                if (err) {
                    if(boolean==true)console.log(err);
                    throw err;
                }
                if(boolean==true)console.log('UDP message sent!!!! ' + remote.address + ':' + remote.port);               
            });
        }catch(err){
            if(boolean==true)console.log('UDP send Error');
        }
    }

    if(boolean==true)console.log("udpserver >> "+remote.address + ':' + remote.port + ' - ' + message);
    if(msgstring.substring(0,2)=="<?"){
        xmlparser.parseString(message,function(err, res){
            if(modifyparameterfunc!=null){
                try{
                var result=res.root;
                var client={type:'udpsocket',data:{UDPserver,remote},name:null};
                    if(result.length==undefined)modifyparameterfunc(result,client);
                    else for(var i=0; i<result.length;i++) modifyparameterfunc(result[i],client);   
                }catch(err){
                    console.log(err);
                }
            }
            HandlingObjectAsync(result,function(error, results){udpsend(JSON.stringify(results),remote); });
        });
    }
    else if(msgstring.substring(0,1)=='{'||msgstring.substring(0,1)=='['){
    var requestobjects=JSON.parse(message);
    if(modifyparameterfunc!=null){
        var client={type:'udpsocket',data:{UDPserver,remote},name:null};
        if(requestobjects.length==undefined)modifyparameterfunc(requestobjects,client);
        else for(var i=0; i<requestobjects.length;i++) modifyparameterfunc(requestobjects[i],client);   
    }
    HandlingObjectAsync(requestobjects,function(error, results){udpsend(JSON.stringify(results),remote); });
    }
    else udpsend(message,remote);
    //processgroupmessage('udpsocket',{UDPserver,remote},JSON.parse(message));
    /*
    HandlingJSONLinesAsync(message.toString(),function(error, results){
        try{
            UDPserver.send(results, 0, results.length,remote.port,remote.address,function(err, bytes) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                console.log('UDP message sent!!!! ' + remote.address + ':' + remote.port);
            });
        }catch(err){
            console.log('UDP send Error');
        }
    });
    */
});




exports.UDPserver = UDPserver;
exports.setJsonCallback=function(HandlingObjectAsync_input,
                                processgroupmessage_input,modifyparameter
                                //,HandlingObject_input,HandlingJSONLinesinput,HandlingJSONdataAsync_input,HandlingJSONLineAsync_input
                                ){
    //HandlingJSONLines=HandlingJSONLinesinput;
    //HandlingObject=HandlingObject_input;
    
    //console.log('udpserver HandlingObjectAsync>>>', HandlingObjectAsync);
    //HandlingJSONLinesAsync = HandlingJSONLineAsync_input;
    //HandlingJSONdataAsync=HandlingJSONdataAsync_input;
    HandlingObjectAsync = HandlingObjectAsync_input;
    processgroupmessage=processgroupmessage_input;
    modifyparameterfunc=modifyparameter;
    
}