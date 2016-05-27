var http = require('http');
var socketio = require('socket.io');
var fs = require('fs');
var path = require('path');

var server = http.createServer(function(request, response){
    console.log(request.url); 
    if(request.url.substring(request.url.length-3) == ".js" ){
        fs.readFile(request.url.substring(1) , function(error, data){
            response.writeHead(200,{'Content-Type':'text/javascript;charset=UTF-8'} );
            response.end(data);
        });
    
    }else {
        fs.readFile('html.html', function(error, data){
            response.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'} );
            response.end(data);
            console.log(request.url.substring(1));
        });
    }
    
}).listen(52273, function(){
    
    console.log('Server Start');
});
var id = 0;
var io = socketio.listen(server);
//io.set('log level', 2);
io.sockets.on('connection', function (socket){
    
    id = socket.id;
    
    socket.on('rint', function (data){
        console.log('client send data:',data);
        io.sockets.sockets[id].emit('smart',data);
        console.log('check',data);
    });
});