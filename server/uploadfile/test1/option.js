var fs = require('fs');


var localstoragetag2="./option.json";
var g_default={"prefix":"server >","tcp":true,"udp":true,"serial":true,"serialbridge":true,"mysql":false,
                "sqlite":true}

function local_get2(tag,idtable){
    var config=null;
    try{
        config=fs.readFileSync(tag);
        valtable=JSON.parse(config);
    }catch(err){
        console.log('readfile err:',err);
        valtable=idtable;
    }
    for(var id in idtable)
        if(valtable[id]==null)valtable[id]=idtable[id];
    return valtable;
}
function local_set2(tag,valtable)
{
    fs.writeFileSync(tag,JSON.stringify(valtable));
}
function loadconfig(){local_get2(localstoragetag2,g_default);}
function saveconfig(){local_set2(localstoragetag2,g_default);} 

exports.loadconfig=loadconfig;