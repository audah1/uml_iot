var fs = require('fs');


//var data1 = './logfile/MessengerLog.txt';
function get_log_data(callback){
    var logdata=fs.readFileSync("./logfile/MessengerLog.TXT",'utf8');//,function(err, res){
    callback(null,logdata);    
}


//get_log_data(data1);


function register(M_on){
    M_on("GLD",get_log_data);
}
exports.register = register;
exports.get_log_data = get_log_data;