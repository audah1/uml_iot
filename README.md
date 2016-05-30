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
[http://nodejs.org](http://nodejs.org, "노드홈페이지") After connecting the installation to suit your os version

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

Rpc implement using the json data format (`/uml_iot/server/jsonrpcserver`) 