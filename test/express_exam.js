var http = require('http');
var express = require('express');

var app = express();
app.use(function(request , response ) {
    
    response.writeHead(200, { 'Content-Type' : ' text/html' });
    response.end('<h1> hello </h1>');
    
});

http.createServer(app).listen(52273, function() {
    console.log('hello');
});