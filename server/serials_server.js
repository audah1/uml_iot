var HandlingObjectAsync = null;
var modifyparameter=null;
var processgroupmessage=null;
var fs=require('fs');

var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

var option=require('./option.js');
option.loadconfig();

var delimiter='\n';


function serialserver ()
{
    var uart = require("serialport");
    var serialPort = null;

    serialPort = new uart.SerialPort(valtable.serialport, {
        baudrate: 115200,
        parser: uart.parsers.readline(delimiter)
    });
    serialPort.on("open", function () {
        console.log('Serial open!');
        
        serialPort.on('data', function(data) {
            //console.log('data >>>',JSON.parse(data));
            console.log('data >>>');
            console.log(data);
            var requestobjects;
            try{
            requestobjects=JSON.parse(data);
            }catch(err){
                console.log('serial server parse err :', err);
            }
            if(modifyparameter!=null){
                //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!',requestobjects);
                var client={type:'serialsocket',data:serialPort,name:null};
                    if(requestobjects.length==undefined)modifyparameter(requestobjects,client);
                    else for(var i=0; i<requestobjects.length;i++) modifyparameter(requestobjects[i],client);   
            }
            HandlingObjectAsync(requestobjects,function (error, results){
                console.log('Serial handling obj from server',results);
            
                try{
                    serialPort.write(JSON.stringify(results))+delimiter,/*JSON.stringify*/function(err,results){           //단순 write와 콜백
                        console.log("Serial write OK! results:",results);
                    };              
                }
                catch(err){
                    console.log('serial send Error');
                }
            });
            //process.stdout.write(data);
            //setTimeout(function(){processserialdata('data',data);},200);
        });
    });
};
serialserver();
//exports.serialserver=serialserver;
exports.setJSONcallback=function setJSONcallback(HandlingObjectAsync_input,processgroupmessage_input,modifyparameter_input){
    HandlingObjectAsync = HandlingObjectAsync_input;
    processgroupmessage=processgroupmessage_input;
    modifyparameter=modifyparameter_input;
};
//JSON.parse
//JSON.stringify