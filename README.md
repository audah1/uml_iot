# uml_iot
uml iot server based on nodejs

* Node.js (v4.3.2)
* Serial
* TCP / UDP
* Bridge
* JSON RPC
* mySQL / SQlite
* Group chat (TCP & UDP & WEB)
* and so on
* a logger for connect/express servers


## Installation nodejs
[http://nodejs.org](http://nodejs.org, "node").     After connecting the installation to suit your os version


## usage
use common.js

```javascript
var http = require("http");
var express = require("express");
var fs = require("fs");
```

After installation nodejs, you can use command `node` and `npm install`.

Using the `node` command to execute the .js file and if the module is required when using `npm install`.
I have used a module Make reference `package.json` and `npm install`.
```
node test.js
npm install express (expample)

if you have a file package.json
npm install 
```


## configuration

http server(`/uml_iot/server/socket_server.js`) and total server(`/uml_iot/server/socket-chat.js`), TCP server(`/uml_iot/server/TCPserver.js`), UDP server(`/uml_iot/server/udp-server.js`), serial server(`/uml_iot/server/serials_server.js`).  
and these servers exports in `socket-chat.js`.

``` javascript
var socketServer = require('./socket-server');
var udpserver =require('./udp-server');
var serialserver = require('./serials_server');
var pingserver=require('./pingserver');
```

Rpc implement using the json data format (`/uml_iot/server/jsonrpcserver.js`) and (`/uml_iot/server/webroot/jsonrpcclient.js`). like
```json
{"method": "echo", "params": ["Hello JSON-RPC"], "id": 1}
{"result": "Hello JSON-RPC", "error": null, "id": 1}
``` 

All transfer types are single objects, serialized using JSON. A request is a call to a specific method provided by a remote system. It must contain three certain properties:
* `method` - A String with the name of the method to be invoked.  
* `params` - An Array of objects to be passed as parameters to the defined method.  
* `id` - A value of any type, which is used to match the response with the request that it is replying to.

The receiver of the request must reply with a valid response to all received requests. A response must contain the properties mentioned below.  
* `result` - The data returned by the invoked method. If an error occurred while invoking the method, this value must be null.  
* `error` - A specified error code if there was an error invoking the method, otherwise null.  
* `id` - The id of the request it is responding to.


## A brief introduction of each server
##### http server
using `http`,`express`moudle. 
This server can be given a specific function for each url with the express . And you can test your database or rpc using jquery.

##### TCP server
This server using the net module. 
```javascript
var net = require("net");

var server = net.createServer(function(client) {   
    client.on('data', function(data) {
        //data handler using callback
    });
});
server.listen(52273, function() {     
});
```
Using the callback event called 'data' to process the data in json format. 
When you connect the client in `/uml_iot/test/TCP-client` to the server, Join the group using the function 'JIC' to join a particular group , and made ​​it possible for the client together with the same group chat .
tcp, udp, web server and so on .. The following functions(`JIC`,`JAC`,`JRC`) can be found in the `/uml_iot/server/typechat.js`.

##### UDP server
This server using the dgram module.
```javascript
var dgram = require("dgram");

var server = dgram.createSocket('udp4');
    server.bind(52222);
    server.on('message', function(message, remote){
    server.send(remote.address + ':' + remote.port +' - ' + message); //data handler using callback
}
```
Using the callback event called 'message' to process the data in json format. And additionally need remote.
Results of the test are the same as tcp.

##### for windows
Run the server from the command
```
node socket-chat.js
```

When connected to the `http://127.0.0.1:52273` in a Web browser can be a JSON RPC TEST and Ping , group chat , database testing.
  
  and testing TCP, UDP, serial. ( `/uml_iot/test/TCP-client.js`, `/uml_iot/test/udp-client.js`, `/uml_iot/test/serials_client.js` )


## Documentation 
Talk to me.

Thank you!