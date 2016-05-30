var debuggroupList =false;
var debugClientList=true;
var autoaddremovegroup=true;
var chatgroups = {};
var useclientgroup=true;
function notexistgroup(clientlist){
    return clientlist==null||clientlist==undefined;
}
function existgroup(clientlist){
    return !notexistgroup(clientlist);
}
function iterategrouplist(callback,groups)
{
    if(groups==undefined)groups=chatgroups;  //그룹스가 없다면 챗그룹스사용
    for(var groupNAME in groups)   //MAP NOT ARRAY
    {
       var clientlist=groups[groupNAME];   //클라리스트 생성
       if(existgroup(clientlist)){   //있다면 콜백을 부른다.
            callback(null,groupNAME,clientlist);            
        }
    }
}
function printgrouplist(a,groups)                 //iterate samsam
{
    if(groups==undefined)groups=chatgroups;       
    if(a==undefined)a=false;
    console.log('Groups=[');
    iterategrouplist(function(error,groupNAME, clientlist){console.log(groupNAME+':', clientlist);if(a)printclientlist(groupNAME);},groups);
    /*for(var groupNAME in groups)
    {
       var clientlist=groups[groupNAME];
       if(existgroup(clientlist)){
            console.log(groupNAME+':', clientlist);
            if(a)printclientlist(groupNAME);
        }
    }*/
    console.log(']');
}
function hasmember(clientlist){
    var notfound=true;
    if(useclientgroup) //true
        for(var i in clientlist){
            var client=clientlist[i];
            if(existgroup(client)){notfound=false;break;} //
        }
    else notfound=(clientlist.length==0);
    return !notfound;
}
/*
function add2map(groupNAME,groups,group){                               //그룹이라는 것을 추가
    if(groups[groupNAME]!=undefined)groups[groupNAME]=null;
    groups[groupNAME]=group;
    if(debuggroupList)printgrouplist(false,groups);
    return group;  
}*/
function makeGROUP(groupNAME,groups)
{
    if(groups==undefined)groups=chatgroups;
    var clientlist = groups[groupNAME];
    if(existgroup(clientlist))return clientlist;   
    var group = useclientgroup? {}:[];
    
    groups[groupNAME]=group;
    if(debuggroupList)printgrouplist(false,groups);
    return group;
}
function removefrommap(groupNAME,groups){
    //delete groups[groupNAME];
    groups[groupNAME]=undefined;
    if(debuggroupList)printgrouplist(false,groups);   
}
function removeGROUP(groupNAME,groups)
{
    if(groups==undefined)groups=chatgroups;
    var clientlist = groups[groupNAME];
    if(notexistgroup(clientlist))return;
    if(hasmember(clientlist))return;
    groups[groupNAME]=undefined;
    if(debuggroupList)printgrouplist(false,groups);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function printclientlist(groupNAME)
{
    //var clientlist=getclientlist(groupNAME);
    var clientlist=chatgroups[groupNAME];
    if(notexistgroup(clientlist))return;
    console.log('group '+groupNAME+'=[');
    
    if(useclientgroup)
    //iterategrouplist(function(error,name,value){console.log(name+":"+value);console.log(',');},clientlist);
        for(var i in clientlist){
            var client=clientlist[i];
            if(existgroup(client)){console.log(i+":"+client);console.log(',');}
        }
    else
    //iteratearraylist(function(error,name,value){console.log(name+":"+value);console.log(',');},clientlist);
        for(var i=0; i<clientlist.length; i++)
        {
            var client=clientlist[i];
            console.log(client);
            if(i==clientlist.length-1);
            else console.log(',');
        }
    console.log(']');
}
function iterateclientlist(groupNAME,callback,message)
{
    var num =0;
    var clientlist=chatgroups[groupNAME];
    if(notexistgroup(clientlist))return 0;
    if(useclientgroup)
        for(var i in clientlist){
            var client=clientlist[i];
            if(existgroup(client)){num++;callback(null, client,message);}
        }
    else
        for(var i=0; i<clientlist.length; i++)
        {
            var client=clientlist[i];
            num++;callback(null, client,message);
        }
    return num;
}
function addclient(groupNAME,client)   ///group in member
{
    var clientlist=chatgroups[groupNAME];
  if(notexistgroup(clientlist)){
      if(autoaddremovegroup)clientlist=makeGROUP(groupNAME);
      else return 0;
  }
//중복가입 방지(client.name)
    if(useclientgroup){
        var name =client.name;
        if(clientlist[name]!=undefined)clientlist[name]=null;
        clientlist[name]=client;
    }
    else{
        for(var i=0; i<clientlist.length; i++)
        {
            if(client.name==clientlist[i].name)
            {
                clientlist.splice(i,1);
            }
        }
        clientlist.push(client);
    }
    if(debugClientList)printclientlist(groupNAME);  
    return 1; 
    }
function removeclient(groupNAME,client)
{
    var clientlist=chatgroups[groupNAME];
    if(notexistgroup(clientlist))return 0;
    if(useclientgroup){
        //removefrommap(client.name,clientlist);
        var name =client.name;
        if(clientlist[name]!=undefined)clientlist[name]=null;
    }
    else{
        for(var i=0; i<clientlist.length; i++)
        {
            if(client.name==clientlist[i].name)
            {
                clientlist.splice(i,1);
                break;
            }
        }
    }
    if(autoaddremovegroup&&!hasmember(clientlist)){
        removeGROUP(groupNAME);
        return 0;
    }

    if(debugClientList)printclientlist(groupNAME);
    return 1;
}
function clientmatch(client1,client2){
    return client1.type==client2.type&&client1.data==client2.data;
}
function removeclientany(client)
{
    for(groupNAME in chatgroups){
        var clientlist=chatgroups[groupNAME];
        console.log('removeclientany>> checking group:'+groupNAME);
        if(notexistgroup(clientlist))continue;
        if(useclientgroup){
            for(name in clientlist){
                console.log('removeclientany>> checking group:'+groupNAME+', name:'+name);
                if(clientlist[name]!=undefined&&clientmatch(clientlist[name],client)){
                    console.log('removeclientany>> delete group:'+groupNAME+', name:'+name);
                    clientlist[name]=null;
                }
            }
        }
        if(autoaddremovegroup&&!hasmember(clientlist)){
            removeGROUP(groupNAME);
            continue;
        }
        if(debugClientList)printclientlist(groupNAME);
    }
}

exports.makeGROUP=makeGROUP;
exports.removeGROUP=removeGROUP;
exports.printgrouplist=printgrouplist;
exports.iterategrouplist=iterategrouplist;

exports.removeclientany=removeclientany;
exports.removeclient=removeclient;
exports.addclient=addclient;
exports.printclientlist=printclientlist;
exports.iterateclientlist=iterateclientlist;

function modifyparameter(requestobject,client,forwardmessage){
    if(requestobject.CMD=="JAC"||requestobject.CMD=="JRC")requestobject.parameter.push(client);
    else if(requestobject.CMD=="JIC")requestobject.parameter.push(forwardmessage);
}
exports.modifyparameter=modifyparameter;

function jsonrpc_addclient(callback,groupNAME, name, client)
{
    //console.log('what is addclient name, client >>>',groupNAME, name, client);
    client.name=name;
    var res=addclient(groupNAME,client);
    callback(null,res);
}
function jsonrpc_iterateclientlist(callback,groupNAME, message,datacallback)
{
    var res=iterateclientlist(groupNAME,datacallback,message);
    callback(null,res);
}
function jsonrpc_removeclient(callback,groupNAME, name, client)
{
    console.log('remove name, client >>>',groupNAME);
    client.name=name;
    var res=removeclient(groupNAME,client);
    callback(null,res);
}
function register(on){
    on("JAC",jsonrpc_addclient);
    on("JIC",jsonrpc_iterateclientlist);
    on("JRC",jsonrpc_removeclient);
}

exports.register=register;
