# uml_iot
uml iot server based on nodejs

* Node.js
* Serial
* TCP/ UDP
* Bridge
* JSON RPC
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

main server('/uml_iot/server/socket_server.js') and socket server('/uml_iot/server/socket-chat.js'), TCP server('/uml_iot/server/TCPserver.js'), UDP server('/uml_iot/server/udp-server.js'), serial server('/uml_iot/server/serials_server.js')

