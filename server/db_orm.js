console.log('mysql loading start');
var db_run=null;
var db_all=null;
var db = null;

var mysql = require('mysql');
var client1 = null; 
function connect2mysql(dbname,user,password){
    client1= mysql.createConnection({
        user:user,
        password:password,
        database:dbname
    });
    db_all=client1.query;
    db_run=client1.query;
    db=client1;
}

var sqlite3 = require('sqlite3').verbose();  
var client2 = null;
function connect2sqlite(dbname){
    client2=new sqlite3.Database(dbname); 
    db_run=client2.run;
    db_all=client2.all;
    db=client2;
}

function createDB(callback,tableName){
    if(client1 !== null)
        db_all.call(db,"CREATE TABLE "+tableName+" (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, DBkey VARCHAR(256) NOT NULL, value VARCHAR(20000) NOT NULL)",callback);
    else
        db_run.call(db,"CREATE TABLE "+tableName+" (id INTEGER  PRIMARY KEY AUTOINCREMENT NOT NULL, DBkey VARCHAR(256) NOT NULL, value VARCHAR(5000) NOT NULL)",callback);
}
function listDBdata(callback,tableName){
     //db_all.call(db,"SELECT DBkey FROM test100",function(error,results){
     db_all.call(db,"SELECT DBkey FROM "+tableName+"",function(error,results){
        var newResults =[];
        //var newVALUE=[];
        if(results!==undefined&&results!==null&&results.length!==undefined)
        for(var i=0; i<results.length;i++)
        {
            newResults[i]=results[i].DBkey;
            //newVALUE[i]=results[i].value;
        }
        callback(error,newResults);
    });
    //db.run('SELECT * FROM test WHERE id = ?',[1],callback);
}
function updateDBdata(callback,tableName,key,value){
    db_run.call(db,"UPDATE "+tableName+" SET value = ? WHERE DBkey = ?",[value,key],function(error,results){
            if(error!==null)console.log('UPDATE error :', error);
            //console.log('UPDATE results :', results);
            callback(null,[]);
        });
}
function insertDBdata(callback,tableName,key,value){
    db_run.call(db,"INSERT INTO "+tableName+" (DBkey, value) VALUES (?,?)",[key,value],function(error,results){
            if(error!==null)console.log('INSERT error :', error);
            //console.log('INSERT results :', results);
            callback(null,[]);
        });
}

function getDBdata(callback,tableName,key){
    db_all.call(db,"SELECT value FROM "+tableName+" WHERE DBkey = ?", key ,function(error, results){
        var newResults=null;
        if(results!==undefined&&results!==null&&results.length!==undefined)
        for(var i=0; i<results.length;i++)
        {
            newResults=results[0].value;
        }
        callback(error,newResults);
    });
    //db.run('SELECT * FROM test WHERE id = ?',[1],callback);
}
function deleteDBdata(callback,tableName,key){
    db_run.call(db,"DELETE FROM "+tableName+" WHERE DBkey=?", key ,function(error,results){
            if(error!==null)console.log('DELETE error :', error);
            //console.log('DELETE results :', results);
            callback(null,[]);
        });
    //db.run('SELECT * FROM test WHERE id = ?',[1],callback);
}


function listitem(callback,tableName){
    return listDBdata(callback,tableName);
}
function setitem(callback,tableName,key,value)
{
    console.log('setitem create try >>>');
    createDB(function(error,result){
        if(error!==null);//console.log('setitem create error >>>', error);
        else console.log('setitem create ok');
        console.log('setitem update try >>>');
        if(value==null||value==undefined){
            deleteDBdata(callback,tableName,key);
            return;    
        }
        updateDBdata(function(error,result){
            //console.log('setitem error >>>', error);
            //console.log('setitem result >>>>',result);
            getDBdata(function(error,result){
                //console.log('setitem verify error >>>', error);
                console.log('setitem verify result >>>>',result);

                if(result!==null&&result!==undefined&&result.length>0)callback(error,result);
                else{
                    console.log('setitem insert try >>>');
                    insertDBdata(callback,tableName,key,value);
                }
            },tableName,key);
        },tableName,key,value);      
    },tableName);
}
function getitem(callback,tableName,key)
{
    console.log('getitem create try >>>');
    createDB(function(error,result){
        if(error!==null);//console.log('getitem create error >>>', error);
        else console.log('getitem create ok');
        console.log('getitem getdata try >>>');
        getDBdata(callback,tableName,key);  
    },tableName);
}
function listobject(callback,tableName){
    return listitem(callback,tableName);
}
function saveobject(callback,tableName,key,object){
    setitem(function(error,results){
            if(error!==null)console.log('setitem error :', error);
            //console.log('setitem results :', results);
            callback(null,results);
        },tableName,key,JSON.stringify(object));
}
function restoreobject(callback,tableName,key){
    getitem(function(error,results){
            if(error!==null)console.log('getitem error :', error);
            //console.log('getitem results :', results);
            callback(null,results);
        },tableName,key);
}
exports.createDB = createDB;
exports.getDBdata = getDBdata;
exports.listDBdata = listDBdata;
exports.updateDBdata = updateDBdata;
exports.insertDBdata = insertDBdata;
exports.delDBdata = deleteDBdata;

exports.listdata = listDBdata;
exports.updatedata = updateDBdata;
exports.getdata = getDBdata;
exports.deletedata = deleteDBdata;
exports.insertdata = insertDBdata;

exports.listitem = listitem;
exports.setitem = setitem;
exports.getitem = getitem;

exports.listobject = listobject;
exports.saveobject = saveobject;
exports.restoreobject = restoreobject;

function register(M_on){
    M_on("CRT",createDB);
    M_on("GET",getDBdata);

    M_on("LST",listDBdata);

    M_on("UPD",updateDBdata);
    M_on("INS",insertDBdata);
    M_on("DEL",deleteDBdata);
    M_on("SVO",saveobject);
    M_on("RES",restoreobject);
    M_on("SETITEM",setitem);
    M_on("GETITEM",getitem);
}
exports.register =register;
exports.connect2mysql=connect2mysql;
exports.connect2sqlite=connect2sqlite;
//console.log('mysql loading connect');
console.log('mysql loading end');