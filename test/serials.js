var uart = require("serialport");
var jsonrpcserver =require('./jsonrpcserver');
var mathserver = require('./mathserver');
mathserver.register(jsonrpcserver.on);//jsonrpcserver.on == M_on
//var SerialPort = uart.SerialPort;
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
var delimiter='\n';
var serialPort = new uart.SerialPort("com4", {
    baudrate: 115200,
    parser: uart.parsers.readline(delimiter)
});
serialPort.on("open", function () {
    console.log('open!');
    
    serialPort.on('data', function(data) {
        //console.log('data >>>',JSON.parse(data));
        console.log('data >>>');
        console.log(data);
        try{
        var reqobject=JSON.parse(data);
        var requestobjects=data;
        console.log(reqobject);
        }catch(err){
            console.log('parse err :', err);
        }
        jsonrpcserver.HandlingObjectAsync(reqobject,function (error, results){
            console.log('handling obj from server',results);
            try{
                serialPort.write(JSON.stringify(results)+delimiter,/*JSON.stringify*/function(err,results){           //단순 write와 콜백
                    console.log("write OK! results:",results);
                });              
            }
            catch(err){
                console.log('websocket send Error');
            }
        });
        //process.stdout.write(data);
        //setTimeout(function(){processserialdata('data',data);},200);
    });
});