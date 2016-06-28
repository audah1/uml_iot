var bDebug=false;

var operationTable={};
function M_on(cmd,fcn){
    //if(cmd!==undefined)console.log('Already exist cmd : '+cmd );
    operationTable[cmd]=fcn;
}
function M_get(cmd ){return operationTable[cmd];}
var operationTableAsync={};
function M_onAsync(cmd,fcn){
    operationTableAsync[cmd]=fcn;
}
function M_getAsync(cmd ){return operationTableAsync[cmd];}

function M_run(cmd,parameter)
{
    var fcn = M_get(cmd );
    if(fcn == undefined){ 
        if(bDebug)console.log('NoTcallback =====',cmd);
        return -1;
    }else{
    
        if(parameter.a == undefined)        
            return fcn.apply(undefined,parameter);//return fcn(parameter);
       else
            return fcn(parameter.a, parameter.b);//fcn([parameter.a, parameter.b]);
    }
}
function M_runAsync(cmd,parameter,callback)
{
    var async=false;
    var fcn = M_get(cmd );
    if(fcn == undefined){ 
        fcn = M_getAsync(cmd );
        if(fcn == undefined){
            if(bDebug)console.log('NoTcallback second =====',cmd);
            return -1;
        }
        async=true;
    }
    if(async){    
       if(parameter.a == undefined){        
            var param =[];
            param[0]=callback;
            for(var i=1; i<=parameter.length;i++)
            {
                param[i]=parameter[i-1];    
            }
             fcn.apply(undefined,param);//fcn(callback,parameter[0],parameter[1],parameter[2],parameter[3],parameter[4]);////return fcn(callback,parameter);
       }
       else
            fcn(callback, parameter.a, parameter.b);//fcn(callback,[parameter.a, parameter.b]);
    }else{
        var outputdata;
       if(parameter.a == undefined)        
            outputdata=fcn.apply(undefined,parameter);//return fcn(parameter);
       else
            outputdata= fcn(parameter.a, parameter.b);//fcn([parameter.a, parameter.b]);
       if(bDebug)console.log('M_runAsync resData >>>>>',outputdata);
       callback(null,outputdata);
    }
}
function HandlingObject(requestobject){
    var responseobject;
        if(bDebug)console.log('HandlingObject : Recieved object from client', requestobject);
        if(requestobject.length==undefined){ //길이가 undefined라면 객체일 것이다.
            responseobject={};    
            responseobject.RES= M_run(requestobject.CMD, requestobject.parameter);
            responseobject.id= requestobject.id;
        }
        else{
            responseobject=[];    
            for(var i=0; i<requestobject.length;i++)
            {
                responseobject[i]={};
                responseobject[i].RES= M_run(requestobject[i].CMD, requestobject[i].parameter);
            }
            responseobject[0].id= requestobject[0].id;
        }   
        if(bDebug)console.log('========================================',responseobject);

        return responseobject;
}
function HandlingObjectAsync(requestobject,callback){

    console.log('HandlingObjectAsync : Recieved object from client', requestobject);
    if(requestobject.length==undefined){ //길이가 undefined라면 객체일 것이다.
        var responseobject={};
        M_runAsync(requestobject.CMD, requestobject.parameter,function(error, results){
            responseobject.RES=results;
            responseobject.id= requestobject.id;
            callback(error,responseobject);
        });
    }
    else{
        var responseobjects=[];    
        for(var i=0; i<requestobject.length;i++)
        {
            responseobjects[i]={};
            responseobjects[0].id= requestobject[0].id;
            M_runAsync(requestobject[i].CMD, requestobject[i].parameter,function(error, results){
                if(bDebug)console.log('HandlingObjectAsync resData >>>>>',results);
                responseobjects[i].RES= results;
                
                if(i==requestobject.length-1)callback(error,responseobjects);
            });
        }
    }   
    
    return responseobject;
}

var useBroadcast = false;

exports.on = M_on;
exports.onAsync = M_onAsync;
exports.HandlingObject = HandlingObject;
exports.HandlingObjectAsync = HandlingObjectAsync;