var fs = require('fs');
/////////////////////////////////////////////////////////////////////////////////////////////////////////normal search
/*
//var data1 = './logfile/MessengerLog.txt';
function get_log_data(callback){
    var logdata=fs.readFileSync("./logfile/MessengerLog.TXT",'utf8');//,function(err, res){
    callback(null,logdata);    
}
*/
/*
function get_log_data(callback,start,end){
    var getdata1 = fs.readFile("./logfile/MessengerLog.txt","utf-8",function(err,res){
        var getdata2='';
        for(var i=5; i>0; i--)
        {
            fs.readFile("./logfile/MessengerLog.txt."+i,"utf-8",function(err1,res){
                getdata2 += res;
            });
        }
        var get_totaldata=res+getdata2;
        console.log(get_totaldata);
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
            return null; //not found
        }
        var startpoint=find_start_end_of_logdata(get_totaldata,start);
        console.log("s.p =",startpoint);
        var endpoint = find_start_end_of_logdata(get_totaldata,end);
        console.log("e.p =",endpoint);
        if(endpoint==null)endpoint=res.length-1;
        //var enddata2=end.substring(0,9)+end.substring(10)+1;
        //console.log(enddata2);
        //var getdata = data.substring(startpoint,enddata2-1);
        var getdata = get_totaldata.substring(startpoint-1,endpoint-1);
        callback(null,getdata); 
    })
    //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!",get_totaldata);
}
*/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////binary search
function getfilelength_fcn(filepath){
    var filestat=fs.statSync(filepath);
    return filestat.size;
}
//console.log(getfilelength_fcn("./logfile/MessengerLog.txt.1"));
function getfiledata(callback,filepath,position,buf_size){
    var buf = new Buffer(buf_size);
    fs.open(filepath,'r',function(err,res){
        fs.read(res,buf,0,buf_size,position);
        fs.closeSync(res);
        callback(null,buf);
    });
    /////////////////////////////async 방식으로 
}
function getfiledata_fcn(filepath,position,buf_size){
    var buf = new Buffer(buf_size);
    var fd=fs.openSync(filepath,'r');
    fs.readSync(fd,buf,0,buf_size,position);
    fs.closeSync(fd);
    return buf.toString();
}
function getfileline_fcn(filepath,position){
    var totalleng=getfilelength_fcn(filepath);
    var length=1000;
    if(totalleng-position>length)length=totalleng-position;
    
    var filedata= getfiledata_fcn(filepath,position,length);
    var lines=filedata.split("\n");
    if(position==0)return lines[0];
    else if(lines.length<2)return lines[lines.length-1];
    else return lines[1]; //중간파일의 내용 추출용
}
//console.log("getfiledata test :::::", getfiledata_fcn("./logfile/MessengerLog.txt",2900,1000));
//console.log("getfileline_fcn test :::::", getfileline_fcn("./logfile/MessengerLog.txt.1",2900));

function file_bsearch(filename,pos,getfilelength_fcn,getfileline_fcn,st){
    var totalleng=getfilelength_fcn(filename);
    var low=0,high=getfilelength_fcn(filename)-1;
    while(low<=high)
    {
        var midposition=Math.floor((low+high)/2);
        //console.log("3321321",midposition);
        var midval = getfileline_fcn(filename,midposition).substr(1,10);
        console.log("what the problem", midval);
        //if(text[])
        if(pos.localeCompare(midval)==1){low=midposition+1;}//pos=text[midposition+1].substring(0,10);
        else if(pos.localeCompare(midval)==-1){high=midposition-1;}//pos=text[midposition-1].substring(0,10);
        else if(pos.localeCompare(midval)==0)return midposition;//text[midposition].substring(0,10);
    }
    //low>high

    if(st){
       var midval = getfileline_fcn(filename,0).substr(1,10); 
       console.log("stmid :", midval);
       console.log("stpos :", pos);
       if(pos.localeCompare(midval)==-1)return 0;
    }else{
       var midval = getfileline_fcn(filename,totalleng-1000).substr(1,10);  
       console.log("edmid :", midval);
       console.log("edpos :", pos);
       if(pos.localeCompare(midval)==1)return totalleng;
    }
    console.log("low ==",low);
    console.log("f. length ==",totalleng);
    return low;
}

//console.log("bsearch test ====>> ",file_bsearch("./logfile/MessengerLog.txt","2016-03-16",getfilelength_fcn,getfileline_fcn))

function get_logdata_onfile(callback,filepath,start,end){
    var result='';
    console.log("file length ::",getfilelength_fcn(filepath));
    //var end1=end.substring(0,9)+(Number(end.substring(9))+1);
    var startsearch=file_bsearch(filepath,start,getfilelength_fcn,getfileline_fcn,true);
    console.log("a.s=",startsearch);
    var endsearch=file_bsearch(filepath,end,getfilelength_fcn,getfileline_fcn,false);
    console.log("e.s=",endsearch);
    if(startsearch==endsearch){callback(null,"");return;}   //start와 end가 파일을 넘을때 
    result=getfiledata_fcn(filepath,startsearch,endsearch-startsearch);
    
    /*var getfiledatasplit=getfiledata.split('\n');
    for(var i=0;i<getfiledatasplit.length;i++){
        result+=getfiledatasplit[i];
    }*/
    //console.log("tres5 :",result);
    callback(null,result);
}
function get_logdata_onfile_all(callback,start,end){
    var results='';
    function callback0(err,res){
        //console.log("3rd :",res);
        results+=res+'\n';      
        console.log("1st :",results);
        callback(null,results);  
    }
    function callback1(err,res){
        //console.log("2nd :",res);
        results+=res+'\n';
        console.log("1st :",results);
        get_logdata_onfile(callback0,"./logfile/MessengerLog.txt",start,end);
    }
    function callback2(err,res){
        //
        results+=res+'\n';
        console.log("1st :",results);
        get_logdata_onfile(callback1,"./logfile/MessengerLog.txt.1",start,end);
    }
    get_logdata_onfile(callback2,"./logfile/MessengerLog.txt.2",start,end);
    
}

function register(M_on){
    M_on("GLD",get_logdata_onfile);
    M_on("GGD",get_logdata_onfile_all);
}
exports.register = register;
exports.get_logdata_onfile = get_logdata_onfile;