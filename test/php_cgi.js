var http=require("http");
var fs=require("fs");
var path=require("path");
var url =require("url");

var express= require('express');

var app=express();

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

app.route('*.php*')
    .all(function(req, res) {
        reqdata = require("url").parse(req.url,true);
var filepath = path.join(__dirname,reqdata.pathname);
        var phpCGI = require("php-cgi");
        phpCGI.detectBinary();//on windows get a portable php to run.
        phpCGI.env['DOCUMENT_ROOT'] = __dirname;//+path.sep+'htdocs'+path.sep;
        phpCGI.serveResponse2(req, res, phpCGI.paramsForRequest(req),filepath, function(err, phpres){
        
            var testphp=gethead(phpres);

            res.writeHead(200,testphp.head);
            res.end(testphp.body);
        });

    });

app.use('/mantisbt-1.2.19', express.static(__dirname + '/mantisbt-1.2.19'));
app.use('/moniwiki', express.static(__dirname + '/moniwiki'));

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
})

