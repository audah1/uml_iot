//var jsonclient; 
//var $;  
//var exports={};
require([/*"./xml2js/lib/xml2js",*/"/static/jsonrpcclient.js","/static/jquerynew/jquery.js","/static/jquerynew/jquery.cookie.js",
        "/static/bravo.js","/static/ansi_up-master/ansi_up.js"],function(/*xml2js,*/jsonclient,$){
    /*var b=require(["/static/b.js"],function(b){
        if(debug)console.log('b input>>>>>');
        if(debug)console.log(b.func());
    });*/
    //jsonclient=exports;// jsonclientInput;
    //jsonclient= jsonclientInput;
    //$=jquery;
var debug=false;

$(document).ready(main);
    function main(){
        function getcontrols(idtable){       //값저장
            var valtable={};
            for(var i=0; i<idtable.length;i++)
            {
                valtable[idtable[i]]=$('#'+idtable[i]+'').val();
            }
            return valtable;
        }
        function setcontrols(idtable,valtable){
            for(var i=0; i<idtable.length;i++)
            {               
                $('#'+idtable[i]+'').val(valtable[idtable[i]]);
            }
        }
        //localStorage or cookie
        var localstoragetag="sample";
        function local_get(tag,idtable,deftable){
            var valtable={};
            /*
            for(var i=0; i<idtable.length;i++)
            {
                valtable[idtable[i]]=localStorage.getItem(tag+idtable[i]);
                //valtable[i]=$.cookie(tag+idtable[i]);
                if(valtable[idtable[i]]==null)valtable[idtable[i]]=deftable[i];
            }*/
            valtable=JSON.parse(localStorage.getItem(tag));
            for(var i=0; i<idtable.length;i++)
                if(valtable[idtable[i]]==null)valtable[idtable[i]]=deftable[i];
            
            return valtable;
        }
        function local_set(tag,idtable,valtable){
            /*
            for(var i=0; i<idtable.length;i++)
            {
                localStorage.setItem(tag+idtable[i],valtable[idtable[i]]);
                //$.cookie(tag+idtable[i],valtable[i]);
            }*/
            localStorage.setItem(tag,JSON.stringify(valtable));
        }
        var g_idtable=['pingtestaddress','CH_NAME','CH_MESSAGE','DB_ID','DB_NAME','DB_MN','DB_SEI','SQ_table',
                    'SQ_key','SQ_value','GC_TYPE','GC_NAME','GC_CLIENT'];
        var g_deftable=['name','message','id','Name','model num','series','table name','key',
                    'value','JAC','KANG','MM'];
        function loadconfig0(){setcontrols(g_idtable,local_get(localstoragetag,g_idtable,g_deftable));}
        function saveconfig0(){local_set(localstoragetag,g_idtable,getcontrols(g_idtable));} 
        
        //var g_default=JSON.parse('{"CH_NAME":"123","CH_MESSAGE":"","DB_ID":"","DB_NAME":"","DB_MN":"","DB_SEI":"","SQ_table":"","SQ_key":"","SQ_value":"","GC_TYPE":"","GC_NAME":"","GC_CLIENT":""}');
        var g_default={'pingtestaddress':"192.168.2.254","CH_NAME":"name","CH_MESSAGE":"message","DB_ID":"id","DB_NAME":"Name","DB_MN":"model num","DB_SEI":"series","SQ_table":"table name","SQ_key":"key",
                    "SQ_value":"value","GC_TYPE":"JAC","GC_NAME":"KANG","GC_CLIENT":"MM"};

        function getcontrols2(idtable){       //값저장
            var valtable={};
            for(var id in idtable)
            {
                valtable[id]=$('#'+id+'').val();
                //for(var id in idtable)
                //    if(valtable[id]==null)valtable[id]=idtable[id];
            }
            return valtable;
        }
        function setcontrols2(idtable,valtable){
            for(var id in idtable)
            {               
                $('#'+id+'').val(valtable[id]);
            }
        }
        var localstoragetag2="sample3";
        function local_get2(tag,idtable){
            var valtable={};
            var config=localStorage.getItem(tag);
            if(config==null)valtable=idtable;
            else valtable=JSON.parse(config);
            for(var id in idtable)
                if(valtable[id]==null)valtable[id]=idtable[id];
            
            return valtable;
        }
        function local_set2(tag,valtable)
        {
            localStorage.setItem(tag,JSON.stringify(valtable));
        }
        function loadconfig(){setcontrols2(g_default,local_get2(localstoragetag2,g_default));}
        function saveconfig(){local_set2(localstoragetag2,g_default,getcontrols2(g_default));} 

        //$("#myTable").tablesorter( {sortList: [[0,0], [2,0]]} ); 
        var getRPC =jsonclient.rpc;
        var HandlingJSONresult=jsonclient.HandlingJSONresult;
        var HandlingJSONres=jsonclient.HandlingJSONres;
        
        function writeData(socket, jsonMsg){
            socket.emit('rpcreq',jsonMsg);
            //socket.emit('message',jsonMsg);
        }
        var HobbitsRPC = getRPC("Hobbits",52222,function(rsvd,res){if(debug)console.log("OperHobbits Result == ", res);});

        var socket=null;
        function groupchat(){
            socket = io.connect();
            
            HobbitsRPC.client=socket;
            socket.on('connect', function(){
                if(debug)console.log('wsocket connect!!!!!!!!!!!!!');
            });
            socket.on('disconnect', function(){
                setTimeout(groupchat,3000);
                if(debug)console.log('wsocket disconnect!!!!!!!!!!!!!');
            });
            socket.on('event', function(data){
                if(debug)console.log('what is event connect!!!!!!!!!!!!!');
            });
            
            var txt  = "\n\n\033[1;33;40m 33;40  \033[1;33;41m 33;41  \033[1;33;42m 33;42  \033[1;33;43m 33;43  \033[1;33;44m 33;44  \033[1;33;45m 33;45  \033[1;33;46m 33;46  \033[1m\033[\n\n\033[1;33;40m >> Tests OK \n\n\033[1;33;40m "
                var consolehtml = ansi_up.ansi_to_html(txt);
                var cdiv = document.getElementById("console");
                cdiv.innerHTML=consolehtml;
                //$('#console').html(html);
                
            socket.on('rpcres', function(data){  //wsocket rpc
                if(debug)console.log('rpcres=', data);
                //var txt  = "\n\n\033[1;33;40m 33;40  \033[1;33;41m 33;41  \033[1;33;42m 33;42  \033[1;33;43m 33;43  \033[1;33;44m 33;44  \033[1;33;45m 33;45  \033[1;33;46m 33;46  \033[1m\033[0\n\n\033[1;33;42m >> Tests OK\n\n"
                consolehtml+=ansi_up.ansi_to_html("test : "+data.RES+'\n');
                var cdiv = document.getElementById("console");
                cdiv.innerHTML=consolehtml;
                //$('#console').append(html);
                   // HandlingJSONres(/*JSON.parse*/(data));
                    //$('#CH_NAME').val('rpc');
            });
            /*
            $('#buttonGROUPSEND').click(function(){
                var data=[$('#GC_TYPE').val(),$('#GC_NAME').val(),$('#GC_CLIENT').val()];
                socket.emit('groupmessage',data);
            });
            */
            
            socket.on('groupmessage', function(data){
                if(debug)console.log("groupmessage :",data);
                consolehtml+=ansi_up.ansi_to_html("GROUP message! :"+data+'\n');
                var cdiv = document.getElementById("console");
                cdiv.innerHTML=consolehtml;
                //'#console').append(html);
            });
            
            socket.on('message', function(data){
                if(debug)console.log('message data=');
                if(debug)console.log(data);
                if(data.name==undefined){
                    HandlingJSONres(/*JSON.parse*/(data));$('#CH_NAME').val('rpc');
                }else{
                    var output = '';
                    output += '<li>'
                    output +=   '<h3>' + data.name + '</h3>';
                    output +=   '<p>' + data.message + '</p>';
                    output +=   '<p>' + data.date + '</p>';
                    output += '</li>';
                    
                    $(output).prependTo('#content');
                }
            });
        }
  
        function makereqobj(CMD, param){
            var requestobject={};
            requestobject.CMD = CMD;
            requestobject.parameter = param;
            
            return requestobject;
        }

        function printresult(param,data){
                var output = '';
                output += '<li>'
                output +=   '<h3>' + param + '</h3>';
                output +=   '<p>' + data + '</p>';
                output +=   '<p>' + new Date().toUTCString() + '</p>';
                output += '</li>';
                $(output).prependTo('#content');
        }        
        function ajaxRPC(requestobject,async){ 
            if(async!==undefined)async=false;
            var requestobject = HobbitsRPC.makeObject(requestobject,function(rsvd,res){
            });
            
            var ajaxres= $.ajax({
                type:"post",
                url:"/chat",
                data: {rpc:JSON.stringify(requestobject)},
                async:async,
                success:
                    function(recvData){
                        //HandlingJSONres(JSON.parse(recvData));
                    },
                // beforeSend:showRequest,  
                error:function(e){alert(e.responseText);}
            });
            return (JSON.parse(ajaxres.responseText).RES);
        }
        
        
        console.log('$(document).ready start');
        loadconfig();
        groupchat();
        
        $('#button_pingtest').click(function(){
            var senddata =(HobbitsRPC.makeObject(makereqobj("TSTPING",[$('#pingtestaddress').val()]),function(rsvd,res){
                //printresult('Ping result!',res);
            }));
            writeData(HobbitsRPC.client,senddata);
        });
        $('#button_getlogdata').click(function(){
            var senddata =(HobbitsRPC.makeObject(makereqobj("GLD",[]),function(rsvd,res){
                //printresult('Ping result!',res);
            }));
            writeData(HobbitsRPC.client,senddata);
        });
        $('#button_sendajax').click(function(){
            $.ajax({
                type:"post",  
                url:"/chat",    
                data:{
                    rpc: $('#CH_NAME').val(),
                    message: $('#CH_MESSAGE').val(),
                    date: new Date().toUTCString()
                },
                success:function(args){
                    var test = JSON.parse(args);
                    $(printresult('ajax',test.rpc)).prependTo('#content');
                },
                // beforeSend:showRequest,  
                error:function(err){alert(err.responseText);}
            });
        });
        $('#button_sendwebsocket').click(function(){
            socket.emit('message', {
            name: $('#CH_NAME').val(),
            message: $('#CH_MESSAGE').val(),
            date: new Date().toUTCString()
            });
        });
        $('#button_getjson').click(function(){
            $.getJSON('./static/result.json',function(call){
                console.log("whatis",call);
                //$.each(call, function(index, entry){          
                //})
            $('#stage').html('<p> Name: ' + call.name + '</p>');
            $('#stage').append('<p>Age : ' + call.age + '</p>');
            $('#stage').append('<p> Sex: ' + call.sex + '</p>');
            });
        });
        $('#button_sendwebsocketrpc').click(function(){
            var senddata = /*JSON.stringify*/(HobbitsRPC.makeObject(makereqobj("ADD",[1,2,3,4,5,6]),function(rsvd,res){
            }));
            //var xmldata= builder.buildObject(senddata); 
            writeData(HobbitsRPC.client,senddata);
        });
        $('#button_postrpc').click(function(){
            //var HandlingObject=jsonclient.HandlingObject;
            var requestobject2 = {CMD:"ADDS", parameter:[12,20,30,40,50,60,70,80,901,100]};
            var res =ajaxRPC(requestobject2,false); 
                if(debug)console.log('pst rpc return Value!! =', res);
                printresult('post rpc data',(res));
                //output +='<button id="buttontest" click="문장"> button in table </button>'
                //$('#buttontest').click(function(){ alert('button test');});
        });
        $('#buttonCREATETABLE').click(function(){
            var table=$('#SQ_table').val();
            var requestobject2 = {CMD:"CRT", parameter:[table]};
            var res =ajaxRPC(requestobject2,false);
            if(debug)console.log('return Value =', res);
                printresult('data list',JSON.stringify(res));
                //$('#content').html(output);
        });   
        $('#button_mysqllist').click(function(){
            var table=$('#SQ_table').val();
            var requestobject2 = {CMD:"LST", parameter:[]};
            var requestobject2 = {CMD:"LST", parameter:[table]};
            var res =ajaxRPC(requestobject2,false); 
            if(debug)console.log('return Value =', res);
                printresult('data list',JSON.stringify(res));
                //$('#content').html(output);
        });
        $('#button_mysqldeletedata').click(function(){
            var id=$('#DB_ID').val();
            var table=$('#SQ_table').val();
            var key=$('#SQ_key').val();
            //var requestobject3 = {CMD:"DEL", parameter:[id]};
            var requestobject3 = {CMD:"DEL", parameter:[table,key]};
            var res =ajaxRPC(requestobject3,false); 
            if(debug)console.log('return Value =', res);
                printresult('data delete',JSON.stringify(res));
        });
        $('#buttonmysqlgetdata').click(function(){
            var id=$('#DB_ID').val();
            var table=$('#SQ_table').val();
            var key=$('#SQ_key').val();
            var requestobject3 = {CMD:"GET", parameter:[id]};
            var requestobject3 = {CMD:"GET", parameter:[table,key]};
            var res =ajaxRPC(requestobject3,false); 
            var name=$('#DB_NAME').val();
            $('#DB_NAME').val(res[0].name);
            $('#DB_MN').val(res[0].modelnumber);
            $('#DB_SEI').val(res[0].series);
            if(debug)console.log('return Value =', res);
                printresult('data result',JSON.stringify(res));
        });
        $('#buttonmysqlinsert').click(function(){
            var name=$('#DB_NAME').val();
            var modelnumber = $('#DB_MN').val();
            var series=$('#DB_SEI').val();
            var table=$('#SQ_table').val();
            var key=$('#SQ_key').val();
            var value=$('#SQ_value').val();
            var requestobject3 = {CMD:"INS", parameter:[name,modelnumber,series]};
            var requestobject3 = {CMD:"INS", parameter:[table,key,value]};
            var res =ajaxRPC(requestobject3,false); 
            if(debug)console.log('return Value =', res);
                printresult('data insert',JSON.stringify(res));
        }); 
                //loadconfig
        $('#buttonUPDATE').click(function(){
            var name=$('#DB_NAME').val();
            var modelnumber = $('#DB_MN').val();
            var series=$('#DB_SEI').val();
            var table=$('#SQ_table').val();
            var key=$('#SQ_key').val();
            var value=$('#SQ_value').val();
            var id=$('#DB_ID').val();
            var requestobject3 = {CMD:"UPD", parameter:[name,modelnumber,series,id]};
            var requestobject3 = {CMD:"UPD", parameter:[table,key,value]};
            var res =ajaxRPC(requestobject3,false); 
            if(debug)console.log('return Value =', res);
                printresult('data update',JSON.stringify(res));
        });
        $('#buttonSAVEOBJ').click(function(){
            var name=$('#DB_NAME').val();
            var modelnumber = $('#DB_MN').val();
            var series=$('#DB_SEI').val();
            var table=$('#SQ_table').val();
            var key=$('#SQ_key').val();
            var object=$('#SQ_value').val();
            var id=$('#DB_ID').val();
            var requestobject3 = {CMD:"SVO", parameter:[name,modelnumber,series,id]};
            var requestobject3 = {CMD:"SVO", parameter:[table,key,object]};
            var res =ajaxRPC(requestobject3,false); 
            if(debug)console.log('return Value =', res);
                printresult('data save obj',JSON.stringify(res));
        });
        $('#buttonRESTOREOBJ').click(function(){
            var name=$('#DB_NAME').val();
            var modelnumber = $('#DB_MN').val();
            var series=$('#DB_SEI').val();
            var table=$('#SQ_table').val();
            var key=$('#SQ_key').val();
            var id=$('#DB_ID').val();
            var requestobject3 = {CMD:"RES", parameter:[name,modelnumber,series,id]};
            var requestobject3 = {CMD:"RES", parameter:[table,key]};
            var res =ajaxRPC(requestobject3,false); 
            if(debug)console.log('return Value =', res);
                printresult('data res obj',JSON.stringify(res));
        });
        $('#buttonCREATE').click(function(){
            var table=$('#SQ_table').val();
            var requestobject3 = {CMD:"CRT", parameter:[table]};
            var res =ajaxRPC(requestobject3,false); 
            if(debug)console.log('return Value =', res);
                printresult('db create',res);
        });
        $('#buttonSETDATA').click(function(){
                var table=$('#SQ_table').val();
                var key=$('#SQ_key').val();
                var value=$('#SQ_value').val();
                var requestobject3 = {CMD:"SET", parameter:[table,key,value]};
                var res =ajaxRPC(requestobject3,false); 
                if(debug)console.log('return Value =', res);
                    printresult('set data',res);
        });
        $('#buttonGETDATA').click(function(){
                var table=$('#SQ_table').val();
                var key=$('#SQ_key').val();
                var value=$('#SQ_value').val();
                var requestobject3 = {CMD:"GET", parameter:[table,key,value]};
                var res =ajaxRPC(requestobject3,false); 
                if(debug)console.log('return Value =', res);
                    printresult('get data',res);
        });
        /*$('#buttonjson').click(function(){
            var table=$('#SQ_table').val();
            var key=$('#SQ_key').val();
            var requestobject3 = {CMD:"Get", parameter:[table,key]};
            var res =ajaxRPC(requestobject3,false); 
            if(debug)console.log('return Value =', res);
                printresult('db json',res);
        });*/
        $('#buttonDEL').click(function(){
            var table=$('#SQ_table').val();
            var key=$('#SQ_key').val();
            var requestobject3 = {CMD:"DEL", parameter:[table,key]};
            var res =ajaxRPC(requestobject3,false); 
            if(debug)console.log('return Value =', res);
                printresult('delete data',res);
        });
        $('#buttonINS').click(function(){
            var table=$('#SQ_table').val();
            var key=$('#SQ_key').val();
            var value=$('#SQ_value').val();
            var requestobject3 = {CMD:"INS", parameter:[table,key,value]};
            var res =ajaxRPC(requestobject3,false); 
            if(debug)console.log('return Value =', res);
                printresult('insert data',res);
        });
        $('#buttonUPDATEsq').click(function(){
            var table=$('#SQ_table').val();
            var key=$('#SQ_key').val();
            var value=$('#SQ_value').val();
            var requestobject3 = {CMD:"UPD", parameter:[table,key,value]};
            var res =ajaxRPC(requestobject3,false); 
            if(debug)console.log('return Value =', res);
                printresult('update sq',res);
        });
/*      //cookie
        var gcTYPE= $.cookie('type');
        if(debug)console.log('what the ::::',gcTYPE);
        var gcNAME=$.cookie('groupname');
        var gcCLIENT =$.cookie('name');
        if(gcTYPE==null)gcTYPE="JAC";
        if(gcNAME==null)gcNAME="KANG";
        if(gcCLIENT==null)gcCLIENT="MM";
        
        $('#GC_TYPE').val(gcTYPE);
        $('#GC_NAME').val(gcNAME);
        $('#GC_CLIENT').val(gcCLIENT);

        $('#cookie_remove').click(function(){
        $.cookie('type',$('#GC_TYPE').val());
        $.cookie('groupname',$('#GC_NAME').val());
        $.cookie('name',$('#GC_CLIENT').val());
        });        
*/   
        $('#buttonGROUPSEND').click(function(){ $('#chat').show();
            var data=[$('#GC_TYPE').val(),$('#GC_NAME').val(),$('#GC_CLIENT').val()];
            var requestobject2 = {CMD:$('#GC_TYPE').val(), parameter:[$('#GC_NAME').val(),$('#GC_CLIENT').val()]}; 
            var senddata = /*JSON.stringify*/(HobbitsRPC.makeObject(requestobject2,function(rsvd,res){
                //printresult('group chat',res);
            }));
            writeData(HobbitsRPC.client,senddata);
            saveconfig();
        });
        $('#cookie_save').click(function(){saveconfig();$('#chat').hide();});
        $('#console').css("height",280);
        
        console.log('$(document).ready end');
    }
});
///////////////버튼 a,h,update 위