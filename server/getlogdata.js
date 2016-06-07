var fs = require('fs');

/*
//var data1 = './logfile/MessengerLog.txt';
function get_log_data(callback){
    var logdata=fs.readFileSync("./logfile/MessengerLog.TXT",'utf8');//,function(err, res){
    callback(null,logdata);    
}
*/

function get_log_data(callback,start,end){
    var getdata1 = fs.readFile("./logfile/MessengerLog.txt","utf-8",function(err,res){
        var getdata2='';
        for(var i=4; i>0; i--)
        {
            fs.readFile("./logfile/MessengerLog.txt."+i,"utf-8",function(err1,res1){
                getdata2 += res1;
            });
        }
        var get_totaldata=res+getdata2;
        function find_start_end_of_logdata(bufdata,point){
            var i;
            for(i=0; i<bufdata.length; i++)
            {
                if(bufdata.substring(i,i+10)==point){
                    return i;
                }
                //else if(bufdata.substring(i,i+10)==point){
                //  return i;
                //}
            }
            return -1; //not found
        }
        var startpoint=find_start_end_of_logdata(get_totaldata,start);
        console.log("s.p =",startpoint);
        var endpoint = find_start_end_of_logdata(get_totaldata,end);
        console.log("e.p =",endpoint);
        //var enddata2=end.substring(0,9)+end.substring(10)+1;
        //console.log(enddata2);
        //var getdata = data.substring(startpoint,enddata2-1);
        var getdata = get_totaldata.substring(startpoint-1,endpoint-1);
        callback(null,getdata); 
    })
    //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!",get_totaldata);
}

function register(M_on){
    M_on("GLD",get_log_data);
}
exports.register = register;
exports.get_log_data = get_log_data;