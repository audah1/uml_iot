var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');
var express = require('express');
var serveindex=require('serve-index');
var url =require("url");
var path=require("path");
var multiparty = require('multiparty');
var util = require('util');

var ejs = require('ejs');
var bodyparser = require('body-parser');
var dborm=require('./db_orm');

var log4js=require('log4js');
log4js.configure({ 
 	appenders: [ 
 		{ type: 'console' }, 
 		{ type: 'file', filename: './logfile/MessengerLog.txt', category: 'express',maxLogSize : 12048000 ,backups : 3}
        ,{ type: 'file', filename: './logfile/Messenger2Log.txt', category: 'app',maxLogSize : 12048000 ,backups : 3}
 	]
});

var processgroupmessage =null;
var HandlingObject = null;
var HandlingObjectAsync = null;
var HandlingJSONLinesAsync = null;
var HandlingJSONdataAsync=null;
var modifyparameter=null;
var option=require('./option');
option.loadconfig();

if(valtable.sqlite)dborm.connect2sqlite('abcd.db');

var app = express();
//var logger = log4js.getLogger('express');
var logger2 = log4js.getLogger('app');
logger2.trace('Entering logger2 testing');
//app.use(log4js.connectLogger(logger, { level: 'auto' }));
var urlencodedParser = bodyparser.urlencoded({ extended: false });
var server = http.createServer(app);
server.listen(52273, function(){
    console.log('<<Socket Server running 127.0.0.1:52273>>');
});

function gethead(phpres){
    var head = phpres.split("\r\n\r\n");
    var body=head[1];
    var heads = head[0].split("\r\n");
    var headobj={};
    for(var i=0; i<heads.length; i++){
         var heads1 = heads[i].split(":");
         headobj[heads1[0]]=heads1[1].substr(1);
    }
    return {head:headobj,body:body};
}

function QueryString(hashtag){   //url query string ?a=b&c=d
    var query_string = {};
    var query = decodeURIComponent(hashtag).split("?")[1];
    //console.log("query string ==",query);
    if(query==undefined)return {};
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        //console.log("pair !!=",pair);
        if(pair[1]==undefined)query_string[pair[0]]="";
        else query_string[pair[0]]=pair[1];
        
    } 
    
    return query_string;
}
var path='/uploadfile/';

var io = socketio.listen(server);
io.sockets.on('connection', function(socket){
    socket.on('rpcreq', function(data){
        var requestobjects=/*JSON.parse*/(data);
        console.log("rpcreq : ",requestobjects);
        if(modifyparameter!=null){
            var client={type:'websocket',data:socket,name:null};
            if(requestobjects.length==undefined)modifyparameter(requestobjects,client);
            else for(var i=0; i<requestobjects.length;i++) modifyparameter(requestobjects[i],client);   
        }
        HandlingObjectAsync(requestobjects,function (error, results){
            try{
                socket.emit('rpcres',/*JSON.stringify*/(results));         
            }
            catch(err){
                console.log('websocket send Error');
            }
        });
    });
    socket.on('groupmessage', function(data){
        //processgroupmessage('websocket',socket,['SEND']);
    });
    socket.on('message', function(data){
        if(data.name==undefined){
            console.log('message test socket RPC >>>>>>>',data);
            HandlingObjectAsync(data,function(error, results){
                try{
                    socket.emit('message',results);              
                }catch(err){
                    console.log('websocket send Error');
                }
            });
        }else{
            console.log('message test socket chatting >>>>>>>',data);
            io.sockets.emit('message',data);//message
        }
    });
    socket.on('disconnect', function(err){
        console.log('websocket close');
        processgroupmessage('websocket',socket,['UNSany']);
    });
});

var mkdirurl="/mkdir";
function fileviewonbrowser(url,dataarray,path,nastring,dastring,sastring){/// dataarray = fs.readdir result, path = uploadfile path
    var path1=path.substring(1,path.length-1);
    var path2=path1.split('/');
    var path3='';
    var host=url.split(path.substring(1))[0];
    //if(path2.length==1)path3=path.substring(1);
    for(var i=0;i<path2.length-1;i++)
    {
        path3+=path2[i]+'/';
    }
    console.log("godirec",path3);
    var reshtml='<html><head><title>Index of '+path+'/'+
        '</title><style>th {text-align: center;width:90px}</style><style>tr {height:1150%}</style><style>.filesize {text-align: right;}</style></head>'+
        '<body><h1>Index of <a href=http://127.0.0.1:52273'+path+'>'+path+'</a></h1>'+
        '<a href="http://127.0.0.1:52273/chat">test server</a><p><p>'+
        '<form action="'+mkdirurl+'" method ="get">&nbsp;&nbsp;&nbsp;&nbsp;'+ //mkdir form,,,,<style>tr {text-align: right;}</style>
        'Dir Name :<input type="hidden" id="infile" name="path" value="'+path+'"/><input type="text" name="file"/>'+
        '<input type="submit" value="Make dir" /></form>'+
        '<div><hr/><h3>File download</h3><hr/>'+
        '<pre><table cellpadding="0">'+
        '<tr><th><a href="?'+nastring+'">Name</a></th><th><a href="?'+dastring+'">Modified</a></th><th><a href="?'+sastring+'">Size</a></th>'+
        '<th>download</th><th>delete</th><th>rename</th></tr>'+
        '<tr><td colspan="6"><hr></td></tr>\n';
        if(path2.length!==1){reshtml+='<tr><td><button><a href="'+host+path3+'">Top</a></button></td></tr>';}
    dataarray.forEach(function(cfile) {   //each file
        var file=cfile.name;
        var stats=cfile.stats;//fs.statSync('.'+path+'/'+file);
        var time=JSON.stringify(stats.mtime).split("T");  //mtime split
        var date=time[0].substring(1); //mtime date
        var clock=time[1].substring(0,time[1].length-6);  //mtime hour min sec
        if(stats.mode==16822){
            file=file+'/';stats.size="[Directory]";
        }   //division file&dir
        reshtml+='<tr><td><a href="'+file+'">'+file+'</a></td>'+
        '<td>&nbsp;'+date+' '+clock+'</td>'+
        '<td class="filesize">'+stats.size+'</td>'+///1000+'KB
        '<td>&nbsp;&nbsp;<button><a href="'+file+'" download>Download</a></button></td>'+  //download link
        '<td>&nbsp;&nbsp;<button><a href="/deletefile?path='+path+'&file='+file+'">Delete</a></button></td>'+ //delete
        '<td><form action="/rename" method ="get" style="margin-bottom:0em">'+
            '<input type="hidden" name="path" value="'+path+'" />'+
            '<input type="hidden" name="oldfile" value="'+file+'" />'+
            '<input type="text" name="newfile" />'+ //rename input name-> /rename?name=***&rename="input value"
            '<input type="submit" value="Rename" /></form>'+
        '</td>'
        
        +'</tr>\n';
    });
    reshtml+='</table></div><div><form action="'+path+'" method ="post" enctype="multipart/form-data"><br><p><hr/><h3>File upload</h3><hr/><table><tr><td>Comment:</td>'+
    '<td><input type="text" name="comment"/></td></tr><tr><td>File:</td>'+
    '<td><input id="uploadfile" type="file" name="myfile" multiple/></td></tr></table>'+
    '<input type="submit" value="Upload" /></form></div></body></head></html>\n';
    return reshtml;
}

function get_dirproc(pathin,urlpath){
    var path=pathin;
    //if(pathin[pathin.length-1]=='/')path=pathin.substring(0,pathin.length-1);
    function dirproc(req,res,next){
        fs.readdir(/*'.'+*/path,function(err,result){
            var sortresult=[]; 
            var nastring="nd";
            var dastring="dd";
            var sastring="sd";
            var qs=QueryString(req.url);
            var sortval=1;//name ascend
            function fullUrl(req) {
                return url.format({
                    protocol: req.protocol,
                    host: req.get('host'),
                    pathname: req.originalUrl
                });
            }
            var nowurl=fullUrl(req);
            if(qs.nd!=undefined){nastring="na";sortval=2;}//name descend
            if(qs.na!=undefined){nastring="nd";sortval=1;}//name ascend
            if(qs.dd!=undefined){dastring="da";sortval=4;}//date descend
            if(qs.da!=undefined){dastring="dd";sortval=3;}//date ascend
            if(qs.sd!=undefined){sastring="sa";sortval=6;}//size descend
            if(qs.sa!=undefined){sastring="sd";sortval=5;}//size ascend
            console.log("sortval , path===== ",sortval, path);
            
            if(!(result==undefined||result==null||result.length<=0))
            {

                var cresult=[];
                result.forEach(function(file) {   //each file
                    var stats=fs.statSync(/*'.'+*/path+'/'+file);
                    var time=JSON.stringify(stats.mtime).split("T");  //mtime split
                    var date=time[0].substring(1); //mtime date
                    var clock=time[1].substring(0,time[1].length-6);  //mtime hour min sec
                    var size=stats.size;
                    if(stats.mode==16822){
                        size=0;
                    }   //division file&dir
                    cresult.push({size:size,date:date,clock:clock,name:file,stats:stats});
                })                        
                //var sortresult=(sortval==1? result.sort():result.sort(function(a,b){return b-a;}));  //sort result

                if(sortval>=5)sortresult=(sortval==5? cresult.sort(function(a,b){return a.size-b.size;}):cresult.sort(function(a,b){return b.size-a.size;}));  //sort result
                else if(sortval>=3)sortresult=(sortval==3? cresult.sort(function(a,b){return a.date.localeCompare(b.date);}):cresult.sort(function(a,b){return b.date.localeCompare(a.date);}));  //sort result
                else sortresult=(sortval==1? cresult.sort(function(a,b){return a.name.localeCompare(b.name);}):cresult.sort(function(a,b){return b.name.localeCompare(a.name);}));  //sort result 
            }
            

            
            res.writeHead(200, {'content-type': 'text/html'});
            var reqdata = url.parse(req.url,true);
       
            res.end(fileviewonbrowser(nowurl,sortresult,urlpath+reqdata.pathname,nastring,dastring,sastring));
        });
    }
    return dirproc;
}
function get_uploaddirproc(pathin,currentpath,urlpath){
    var path=pathin;
    if(pathin[pathin.length-1]=='/')pathin.substring(0,pathin.length-1);   //var path='./uploadfile/';
    function uploaddirproc(req,res){
        var form = new multiparty.Form({uploadDir:/*__dirname+*/path});
        
        form.on('file',function(name,file){
            var oldfiledevide=file.path.split("\\");
            var oldfile=oldfiledevide[oldfiledevide.length-1];
            console.log("old file :",oldfile,"new file :",file.originalFilename);
            fs.renameSync(/*'.'+*/path+'/'+oldfile,/*'.'+*/path+'/'+file.originalFilename);
        })
        form.parse(req, function(err) {
            res.redirect(currentpath);
        });
    }
    return uploaddirproc;
}

function uml_serveindex(urlpath){
/*
    function(req,res,next){
        var reqdata = url.parse(req.url,true);
        var filepath = __dirname+reqdata.pathname;//path.join(__dirname,reqdata.pathname);
        
        console.log("filepath ==",filepath);
        var stats=fs.statSync(filepath);
    
            if(stats.mode==16822){
                var pathname1=reqdata.pathname.substr(0,reqdata.pathname.length-1);
                console.log("get_dirproc filepath ==",pathname1);
                get_dirproc(pathname1)(req,res,next);
            }else next();
    }
*/  
    return function(req,res,next){   
        console.log("req.url =",req.url);
        var reqdata = url.parse(req.url,true);
        var filepath = __dirname+urlpath+reqdata.pathname;//path.join(__dirname,reqdata.pathname);

        console.log("filepath ==",filepath);
        var stats=fs.statSync(filepath);

        if(stats.mode==16822){
            if(req.method == 'GET')get_dirproc(filepath,urlpath)(req,res,next);
            else if(req.method=='POST')get_uploaddirproc(filepath,urlpath+reqdata.pathname,urlpath)(req,res,next);
        }else next(); 
    }
}
function unregisterdirproc(app,path){}//w잔머리
function registerdirproc(app,path){
    /*
    console.log("register directory !!! ->",path);
    app.route(path)
        .get(get_dirproc(path))
        .post(urlencodedParser, get_uploaddirproc(path));
        
        
        
    fs.readdir('.'+path,function(err,dataarray){
        dataarray.forEach(function(file) {   //each file
            var stats=fs.statSync('.'+path+'/'+file);
    
            if(stats.mode==16822){
            registerdirproc(app,path+'/'+file);
            }
        });  
            
    });*/
}

function renameproc(req,res){//      url==>   ?path=""&oldfile=""&newfile=""
    //var oldpathname=QueryString(req.url).name; //dir+file
    //var folder='/uploadfile';
    var qs=QueryString(req.url);
    var folder=qs.path;
    var oldfile=qs.oldfile;
    var newfile=qs.newfile;
    //var oldpathname=folder+'/'+oldfile;
    
    fs.renameSync("."+folder+'/'+oldfile, "."+folder+'/'+newfile);   //oldfile path on fileviewonbrowser function
    res.redirect(folder);
}
function deleteproc(req,res){//      url==>   ?path=""&file=""
    var qs=QueryString(req.url);
    var url =qs.file;
    var folder=qs.path;
    var file=qs.file;
    var stats=fs.statSync("."+folder+'/'+file);
    //fs.unlinkSync("."+folder+'/'+file);
    if(stats.mode!==16822)fs.unlinkSync("."+folder+'/'+file);  //file rm
    else {
        fs.rmdirSync("."+folder+'/'+file);  //dir rm
        unregisterdirproc(app,folder+'/'+file);
    }
    res.redirect(folder);
}
function mkdirproc(req,res){//      url==>   ?path=""&file=""
    var qs=QueryString(req.url);
    var folder=qs.path;
    var file=qs.file;
    fs.mkdirSync("."+folder+'/'+file);
    registerdirproc(app,folder+'/'+file);
    res.redirect(folder);
}

app.use('/codebase', express.static(__dirname + '/codebase'));
app.use('/test', express.static(__dirname + '/demos')); //static file
app.use('/test', serveindex('demos',{'icons':true,}));
app.use('/static', express.static(__dirname + '/public')); //static file
app.use('/jqwidgets', express.static(__dirname + '/jqwidgets'));
app.use('/demos', express.static(__dirname + '/demos'));
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/styles', express.static(__dirname + '/styles')); //static file
app.use('/images', express.static(__dirname + '/images'));
app.use('/documentation', express.static(__dirname + '/documentation'));
app.use('/mobiledemos', express.static(__dirname + '/mobiledemos'));
app.use('/phpdemos', express.static(__dirname + '/phpdemos'));
app.use('/jq_index.htm', express.static(__dirname + '/jq_index.htm'));
app.use('/uploadfile', express.static(__dirname + '/uploadfile'));
app.use('/mantis', express.static(__dirname + '/mantis'));
app.use('/moniwiki', express.static(__dirname + '/moniwiki'));

app.use('/uploadfile', uml_serveindex('/uploadfile'));
app.route('/mkdir')
    .get(mkdirproc);
app.route('/rename')////////////////////////////////////////file rename == must be modefied file path **
    .get(renameproc);
app.route('/deletefile')
    .get(deleteproc);
//registerdirproc(app,'/uploadfile');
/*
app.route('/uploadfile*')
    .all(function(req,res,next){
        var reqdata = url.parse(req.url,true);
        var filepath = __dirname+reqdata.pathname;//path.join(__dirname,reqdata.pathname);
        
        console.log("filepath ==",filepath);
        var stats=fs.statSync(filepath);
    
            if(stats.mode==16822){
                var pathname1=reqdata.pathname.substr(0,reqdata.pathname.length-1);
                console.log("get_dirproc filepath ==",pathname1);
                get_dirproc(pathname1)(req,res,next);
            }else next();
    });
*/   
app.route('*.php*')
    .all(function(req, res) {
        var reqdata = require("url").parse(req.url,true);
        var filepath = path.join(__dirname,reqdata.pathname);
        var phpCGI = require("php-cgi");
        phpCGI.detectBinary();//on windows get a portable php to run. php cgi경로
        phpCGI.env['DOCUMENT_ROOT'] = __dirname;//+path.sep+'htdocs'+path.sep;
        phpCGI.serveResponse(req, res, phpCGI.paramsForRequest(req),filepath, function(err, phpres){
        
            var testphp=gethead(phpres);
        
            res.writeHead(200,testphp.head);
            res.end(testphp.body);
        });

    });

app.route('/newpanel')
    .get(function(req,res,next){
        fs.readFile('./webroot/newpanel.html', function(error,data){
            res.writeHead(200,{'Content-Type':'text/html'});
            res.end(data);
        });
    })

app.route('/chat')
    .get(function(req,res,next){
        fs.readFile('./webroot/jqx.html', function(error,data){
            res.writeHead(200,{'Content-Type':'text/html'});
            res.end(data);
        });
    })
    .post(urlencodedParser, function(req,res){
        var data = req.body; ///post rpc
        if(data.rpc==undefined)return;
        HandlingObjectAsync(JSON.parse(data.rpc),function(err, result){      //ajax version
            try{
                console.log('sending rpcres',result);
                res.writeHead(200, {'Content-Type':'text/plain'});
                res.end(JSON.stringify(result));   
            }catch(err){
                console.log('Post send error');
            }
        });
        /*
            var outobj = HandlingObject(JSON.parse(data.rpc)); //안씀. 참조용
            res.writeHead(200, {'Content-Type':'text/html'});
            //io.sockets.emit('message',data); //message
            //res.end(JSON.stringify({res : 'ok'}));
            res.end(JSON.stringify(outobj)+'\n');
        */
    });
    
var tablename= "test100";        //사용할 테이블 이름
app.route('/')
    .get (function(req, res){
       res.redirect('/list')
    })
    
app.route('/list')
    .get (function(req, res){
        fs.readFile('./webroot/list.html', 'utf8', function(error, data){     //////여기서 data는 html그냥
            dborm.listitem(function(error, results){    ////database에서 가져오는 전체 데이터 ....
                res.send(ejs.render(data,{data: results, tableName: tablename}));
            },tablename);
        });
    });

app.route('/delete/:key')
    .get(function(req, res){
        dborm.setitem(function(){res.redirect('/');},tablename,req.params.key,null);
    });
    
app.route('/edit/:key') //url문제 /?id:xx
    .get(function(req, res, next) {
        fs.readFile('./webroot/edit.html', 'utf-8', function(error, data){
            dborm.getitem(function(error, result) {
                res.send(data);
            },tablename,req.params.key);
        });
    })
    .post(urlencodedParser, function(req, res, next) {
        var body = req.body;
        dborm.setitem(function() {res.redirect('/list');},tablename, req.params.key, body.value);
    });

app.route('/insert')
    .get(function(req, res, next) {
        fs.readFile('./webroot/insert.html', 'utf-8', function(error, data) {
            res.send(data);
        });
    })
    .post(urlencodedParser, function(req, res, next) {
        var body = req.body;
        if(body.key==""){console.log('Please insert key value. certainly require key value'),res.redirect('/insert')}
        else {dborm.setitem(function() {res.redirect('/list');},tablename, body.key, body.value);}
    });

exports.socketServer = app;
logger2.trace('exports logger2 testing');
exports.logger2=logger2;
exports.setJsonCallback=function(HandlingObjectAsync_input,processgroupmessage_input,modifyparameter_input){

    HandlingObjectAsync = HandlingObjectAsync_input;
    processgroupmessage=processgroupmessage_input;
    modifyparameter=modifyparameter_input;
}