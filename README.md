# uml_iot
uml iot server based on nodejs

* Node.js
* Serial
* TCP / UDP
* Bridge
* JSON RPC
* mySQL / SQlite
* Group chat (TCP & UDP & WEB)
* and so on
* a logger for connect/express servers

## Install nodejs
[http://nodejs.org](http://nodejs.org, "노드홈페이지") 접속 후 os 버전에 맞게 설치

## usage
use common.js

```javascript
var http = require("http");
var express = require("express");
var fs = require("fs");
```

I have used a module Make reference "package.json" and "npm install".

main server('/uml_iot/server/socket_server.js') and socket server('/uml_iot/server/socket-chat.js'), TCP server('/uml_iot/server/TCPserver.js'), UDP server('/uml_iot/server/udp-server.js'), serial server('/uml_iot/server/serials_server.js').  
and these servers exports in 'socket-chat.js'.

``` javascript
var serialserver = require('./serials_server');
serialserver.setJSONcallback(jsonrpcserver.HandlingObjectAsync,processgroupmessage,modifyparameter);
var serialbridge = require('./serials_bridge');
serialbridge.register(jsonrpcserver.onAsync);

serialbridge.setbroadcastcallback(processgroupmessage);

var tcpbridge = require('./tcp_bridge');
tcpbridge.register(jsonrpcserver.onAsync);
tcpbridge.setbroadcastcallback(processgroupmessage);

var udpbridge = require('./udp_bridge');
udpbridge.register(jsonrpcserver.onAsync);
)udpbridge.setbroadcastcallback(processgroupmessage);

var pingserver=require('./pingserver');
pingserver.register(jsonrpcserver.onAsync);
pingserver.setbroadcastcallback(processgroupmessage);

var getlogdata=require('./getlogdata');
getlogdata.register(jsonrpcserver.onAsync);
```