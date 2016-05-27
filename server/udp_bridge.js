var dgram = require('dgram');


var PORT = 52222;
var HOST = '127.0.0.1';
var remote = {host:'127.0.0.1',port:52222};
client=null;


var processgroupmessage=null;
function sendall(message){
    processgroupmessage(null,null,["SEND","KANG",message]);
}

var udpsend;
function udp_bridge(){
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
    udpsend=function(callback,message){
        process.stdout.write("usend ~~:"+message);
        writeData(client,message,function(err,results){
            callback(null,[]);
        });           
    }
};     
udp_bridge();

function writeData(socket, jsonMsg){
        process.stdout.write("usend :"+jsonMsg);
        client.send(jsonMsg, 0, jsonMsg.length, PORT, HOST, function(err, bytes) {
            if (err) {
                console.log(err);
                throw err;
            }//client.close();
        });
    }
exports.register = function(M_on){
    M_on("USEND",udpsend);
};
exports.setbroadcastcallback = function(processgroupmessage_input){           //여기서 쓰겟다
    processgroupmessage=processgroupmessage_input;
};