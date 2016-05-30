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

## Install nodejs
[http://nodejs.org](http://nodejs.org, "노드홈페이지")  After connecting the installation to suit your os version

## usage
use common.js

```javascript
var http = require("http");
var express = require("express");
var fs = require("fs");
```

## configuration
I have used a module Make reference `package.json` and `npm install`.

main server(`/uml_iot/server/socket_server.js`) and socket server(`/uml_iot/server/socket-chat.js`), TCP server(`/uml_iot/server/TCPserver.js`), UDP server(`/uml_iot/server/udp-server.js`), serial server(`/uml_iot/server/serials_server.js`).  
and these servers exports in `socket-chat.js`.

``` javascript
var socketServer = require('./socket-server');
var udpserver =require('./udp-server');
var serialserver = require('./serials_server');
var pingserver=require('./pingserver');
```

Rpc implement using the json data format (`/uml_iot/server/jsonrpcserver.js`) and (`/uml_iot/server/webroot/jsonrpcclient.js`).  

All transfer types are single objects, serialized using JSON. A request is a call to a specific method provided by a remote system. It must contain three certain properties:
* `method` - A String with the name of the method to be invoked.  
* `params` - An Array of objects to be passed as parameters to the defined method.  
* `id` - A value of any type, which is used to match the response with the request that it is replying to.

The receiver of the request must reply with a valid response to all received requests. A response must contain the properties mentioned below.  
* `result` - The data returned by the invoked method. If an error occurred while invoking the method, this value must be null.  
* `error` - A specified error code if there was an error invoking the method, otherwise null.  
* `id` - The id of the request it is responding to.

## Documentation 
Talk to me.

Thank you!