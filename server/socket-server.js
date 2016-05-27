var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');
var express = require('express');
var url =require("url");
var path=require("path");

var ejs = require('ejs');
var bodyparser = require('body-parser');
var dborm=require('./db_orm');

var log4js=require('log4js');
log4js.configure({ 
 	appenders: [ 
 		{ type: 'console' }, 
 		{ type: 'file', filename: './logfile/MessengerLog.txt', category: 'express',maxLogSize : 2048000 ,backups : 5}
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
var logger = log4js.getLogger('express');

app.use(log4js.connectLogger(logger, { level: 'auto' }));
var urlencodedParser = bodyparser.urlencoded({ extended: false })
var server = http.createServer(app);
server.listen(52273, function(){
    console.log('Server running 127.0.0.1:52273');
});
function serverclose(){process.exit(0);}
var phpnode = require('php-node')({bin:"C:\\Users\\audah\\nodejs\\webchat\\public\\php\\php-cgi.exe"});
app.set('views', __dirname);
app.engine('php', phpnode);
app.set('view engine', 'php');

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
                //onsole.log('sending rpcres',results);
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

app.use('/static', express.static(__dirname + '/public')); //static file

//var route = app.route;

app.route('*.php*')
    .all(function(req, res) {
        //console.log(req.url);
        reqdata = require("url").parse(req.url,true);
var filepath = path.join(__dirname,reqdata.pathname);
        var phpCGI = require("php-cgi");
        phpCGI.detectBinary();//on windows get a portable php to run.
        phpCGI.env['DOCUMENT_ROOT'] = __dirname;//+path.sep+'htdocs'+path.sep;
        phpCGI.serveResponse(req, res, phpCGI.paramsForRequest(req),filepath, function(err, phpres){
        
            var testphp=gethead(phpres);
            //console.log("php head ==",testphp.head);
            //console.log("php body ====",typeof(testphp.body));
        
            res.writeHead(200,testphp.head);
            res.end(testphp.body);
        });

    });

app.route('*favicon.ico*')
    .all(function(req, res) {
        //console.log(req.url);
        fs.readFile("./mantisbt-1.2.19/images/favicon.ico",function(err,data){
        
            //console.log("php head ==",testphp.head);
            //console.log("php body ====",typeof(testphp.body));
        
            res.writeHead(200,{'Contests-Type':'ico/ico'});
            res.end(data);
        });
    });


app.use('/mantisbt-1.2.19', express.static(__dirname + '/mantisbt-1.2.19'));
app.use('/moniwiki', express.static(__dirname + '/moniwiki'));


app.route('/chat')
    .get(function(req,res,next){
        fs.readFile('./public/panel.html', function(error,data){
            res.writeHead(200,{'Content-Type':'text/html'});
            res.end(data);
        });
    })
    .post(urlencodedParser, function(req,res){
        var data = req.body;
        if(data.rpc==undefined)return;
            //res.writeHead(200, {'Content-Type':'text/plain'});//sendajax
            //res.end(JSON.stringify(data));
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
            res.end(JSON.stringify(outobj)+'\n');*/
    });
var tablename= "test100";        //사용할 테이블 이름


app.route('/')
    .get (function(req, res){
       res.redirect('/list')
    })
    
app.route('/list')
    .get (function(req, res){
        fs.readFile('./public/list.html', 'utf8', function(error, data){     //////여기서 data는 html그냥
            dborm.listitem(function(error, results){    ////database에서 가져오는 전체 데이터 ....
                res.send(ejs.render(data,{data: results, tableName: tablename}));
            
            //dborm.listDBdata(function(error, results){                //mysql
              //  res.send(ejs.render(data,{data: results}));              //mysql
            /*client.query('SELECT * FROM products', function(error, results){       //not use module
                res.send(ejs.render(data,{
                data: results      

                }));*/
            },tablename);
        });
    });

app.route('/delete/:key')
    .get(function(req, res){
        dborm.setitem(function(){res.redirect('/');},tablename,req.params.key,null);
        //dborm.delDBdata(function(){res.redirect('/');}, req.params.id);          //mysql
        /*client.query('DELETE FROM products WHERE id=?', [req.params.id],function(){          //not use module
            
            res.redirect('/');
        });*/
    });
    
app.route('/edit/:key') //url문제 /?id:xx
    .get(function(req, res, next) {
        fs.readFile('./public/edit.html', 'utf-8', function(error, data){
            dborm.getitem(function(error, result) {
                res.send(data);
            },tablename,req.params.key);
            //dborm.getDBdata(function(error, result) {           //mysql
            //    res.send(ejs.render(data, { data : result[0]}));             //mysql
            //}, req.params.id );
            /*client.query('SELECT * FROM products WHERE id = ?', [req.params.id], function(error, result) {    //not use module
                res.send(ejs.render(data, { data : result[0]}));
                //res.json(result);
            });*/
        });
    })
    .post(urlencodedParser, function(req, res, next) {
        var body = req.body;
        // body.id is undefined. Then use req.param('id')             
        dborm.setitem(function() {res.redirect('/list');},tablename, req.params.key, body.value);
        //dborm.updateDBdata(function() {res.redirect('/');},body.name, body.modelnumber, body.series, req.params.id );    //mysql
        /*client.query('UPDATE products SET name = ?, modelnumber = ?, series = ? WHERE id = ?', 
            [body.name, body.modelnumber, body.series, req.params.id], function() {                         //not use module
            res.redirect('/');
        });*/
    });

app.route('/insert')
    .get(function(req, res, next) {
        fs.readFile('./public/insert.html', 'utf-8', function(error, data) {
            res.send(data);
        });
    })
    .post(urlencodedParser, function(req, res, next) {
        var body = req.body;
        if(body.key==""){console.log('Please insert key value. certainly require key value'),res.redirect('/insert')}
        else {dborm.setitem(function() {res.redirect('/list');},tablename, body.key, body.value);}
         
        //dborm.insertDBdata(function() {res.redirect('/');},body.name, body.modelnumber, body.series);    //mysql
        /*client.query('INSERT INTO products (name, modelnumber, series) VALUES (?, ?, ?)', [            //not use module
            body.name, body.modelnumber, body.series], function() {
                res.redirect('/');
            }
        );*/
    });

exports.socketServer = app;
//exports.setJsonCallback=function(HandlingObject_input,HandlingObjectAsync_input,HandlingJSONdataAsync_input,HandlingJSONLineAsync_input,processgroupmessage_input,modifyparameter){
exports.setJsonCallback=function(HandlingObjectAsync_input,processgroupmessage_input,modifyparameter_input){

    HandlingObjectAsync = HandlingObjectAsync_input;
    processgroupmessage=processgroupmessage_input;
    modifyparameter=modifyparameter_input;
}