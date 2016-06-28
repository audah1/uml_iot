var http = require('http');
var socketio = require('socket.io');
var express = require('express');
var serveindex=require('serve-index');
var bodyparser = require('body-parser');

var app = express();
var urlencodedParser = bodyparser.urlencoded({ extended: false });
var server = http.createServer(app);
server.listen(52273, function(){
    console.log('<<Socket Server running 127.0.0.1:52273>>');
});

app.use('/test', express.static(__dirname + '/uploadfile')); //static file
app.use('/test', serveindex('uploadfile',{'icons':true,}));