define(function(require, exports, module) {

function sleep(num){	//[1/1000초]
    var now = new Date();
    var stop = now.getTime() + num;
    while(true){
        now = new Date();
        if(now.getTime() > stop)return;
    }
}

var callbackTable={}; //table을 만들어 각 id에 부여된 값을 이용해 callback 함수를 불러준다.
var callbackTable_rsvd = {};

function M_Callback(id,res)
{
    var fcn = callbackTable[id];
    var rsvd = callbackTable_rsvd[id];
    callbackTable[id] = undefined;   ///////부여된 id값 삭제, callback 수행되기전에.
    callbackTable_rsvd[id] = undefined;
    if(fcn == undefined){
        console.log('Non callback : ' , id, res);
        return -1;
    }else{
        return fcn(rsvd, res);
    }
}

function HandlingJSONres(responseobject){
        if(responseobject.length==undefined)M_Callback(responseobject.id, responseobject.RES);                   
        else{
            var results=[];
            for(var i=0; i<responseobject.length; i++)
            {
                results[i]=responseobject[i].RES;
            }
            M_Callback(responseobject[0].id, results);
        }
}

function getRPC(connName, port, fcnCallback){

    var idGererate = 1;
    function writeObject(socket, requestobject_or_objectTable, compCallbackin, rsvd, writeLineInput)
    { //compCallbackin 대신 cb table?
        if(writeLineInput==undefined){
            writeLineInput=writeLine;
        }
        var requestobject,requestobjects;
        if(requestobject_or_objectTable.length==undefined){
            requestobjects=requestobject_or_objectTable;
        }
        else{ 
            requestobject=requestobject_or_objectTable[0];
        }
        requestobject.id = idGererate++;
        var id = requestobject.id;
        callbackTable[id]= compCallbackin;
        callbackTable_rsvd[id]= rsvd;
        writeLineInput(socket,JSON.stringify(requestobjects));
    };
    function makeObject1(requestobject_or_objectTable, compCallbackin, rsvd)
    { //compCallbackin 대신 cb table?
        var requestobject,requestobjects;
        if(requestobject_or_objectTable.length==undefined){ //객체라는거
            requestobjects=requestobject_or_objectTable; 
        }
        else{ //여러개
            requestobject=requestobject_or_objectTable[0];
        }
        requestobjects.id = idGererate++;
        var id = requestobjects.id;
        callbackTable[id]= compCallbackin;
        callbackTable_rsvd[id]= rsvd;

        //writeLine(socket,JSON.stringify(requestobjects));
        return requestobjects||requestobject;

    };
    function makeObject(requestobject_or_objectTable, compCallbackin, rsvd)
    { //compCallbackin 대신 cb table?
        var requestobject,requestobjects;
        if(requestobject_or_objectTable.length==undefined){ //객체라는거
            requestobject=requestobject_or_objectTable; 
        }
        else{ //여러개
            requestobject=requestobject_or_objectTable[0];
            requestobjects=requestobject_or_objectTable;
        }
        requestobject.id = idGererate++;
        var id = requestobject.id;
        callbackTable[id]= compCallbackin;
        callbackTable_rsvd[id]= rsvd;

        //writeLine(socket,JSON.stringify(requestobjects));
        return requestobjects||requestobject;

    };
    return {/*client:client,*/ writeObject:writeObject, makeObject:makeObject};
}

exports.rpc=getRPC;
//exports.HandlingJSONresult=HandlingJSONresult;
exports.HandlingJSONres=HandlingJSONres;

});

/*

//var fcnCallback0 = function(res){console.log("Oper Result == ", res);};
function writeData(socket, datain){
    var data = datain;
    var success = !socket.write(data);
    if (!success){/*
    (function(socket, data){
      socket.once('drain', function(){
        writeData(socket, data);
      });
    })(socket,data);
    } 
}
function writeLine(socket, datain){    //data에 개행을 붙여 처리
    writeData(socket,datain+'\n');
}

function findCharacterPos(strData,charInput){   
    if(charInput == undefined){         
        charInput = '\n';
    }
    for(var i=0; i<strData.length ; i++)
    {
        if(strData[i] == charInput){
            return i;
        }
    }
    return -1; // (-) value is undefined
} //'\n'의 포지션을 찾고 그 위치를 이용해 delimeter

var getConnection = function(connName, port, fcnCallback){
    if(port == undefined)
    {
        port = 8107;
    }
    var client = net.connect({port: port, host:'localhost'}, function() {
    console.log(connName + ' Connected: ');
    console.log('   local = %s:%s', this.localAddress, this.localPort);
    console.log('   remote = %s:%s', this.remoteAddress, this.remotePort);
    this.setTimeout(500);
    this.setEncoding('utf8');
    
    
     
    this.on('data', function(data) {
        console.log('  Bytes received: ' + this.bytesRead);
     
        while(true){
            if(data.length <= 0) break;
                var findCharPos = findCharacterPos(data) // '\n'의 위치를 받음
                var partitiondata = findCharPos<0? data:data.substring(0,findCharPos);
                
                if(data.substring(0,1) =='{')
                {   
                    var responseobject=JSON.parse(partitiondata);
                    console.log('rcieved partitiondata Response data from Server=============',responseobject.RES);
                    console.log('Recieved Response data from Server : ', responseobject.RES);
                    console.log('Recieved Response Id from Server : ', responseobject.id);
            
                    if( findCharPos >= 0 ) data=data.substring(findCharPos+1);
                    else break;
                        if(fcnCallback === undefined )console.log('fcnCallback==',fcnCallback) ;
                
                        else
                            fcnCallback(responseobject.RES);
                }
                else
                    
                {

                    console.log(connName + " From Server: " + data);
                }

                this.end();
        }
    });
    
    
    
    this.on('end', function() {
      console.log(connName + ' Client disconnected');
    });
    this.on('error', function(err) {
      console.log('Socket Error: ', JSON.stringify(err));
    });
    this.on('timeout', function() {
      console.log('Socket Timed Out');
    });
    this.on('close', function() {
      console.log('Socket Closed');
    });
  });
  return client;
};

var buffereddata=""; //not multiple use;
function HandlingJSONresult(data){
    data=buffereddata+data;
    buffereddata="";
    while(true){
        if(data.length <= 0) break;
        var findCharPos = findCharacterPos(data) // '\n'의 위치를 받음
        if(findCharPos<0)
        {
            buffereddata=data;break;
        }
        var partitiondata = findCharPos<0? data:data.substring(0,findCharPos);
        var responseobject = JSON.parse(partitiondata);
        if( findCharPos >= 0 ){
            data=data.substring(findCharPos+1);
            console.log('Recieved Response data from Server:', responseobject);
        }
        else break;     
            
        if(responseobject.length==undefined) 
            M_Callback(responseobject.id, responseobject.RES);                   
        else{
            var results=[];
            for(var i=0; i<responseobject.length; i++)
            {
                results[i]=responseobject[i].RES;
            }
            M_Callback(responseobject[0].id, results);
        }
        
    }
}
*/


