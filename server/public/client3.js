$(document).ready(main);

window.onpopstate = function(event) {     ////////////////////////////히스토리 데이터 객체에 저장하는 기능
    //alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
    hideshow(window.location.hash);
};
function hideshow(name){
    if(name=="#t1"){$("#T1").show();$("#sysinfo").hide();$("#E1").hide();$("#DS3").hide();$("#V35").hide();$("#diaequip").hide();$("#datafile").hide();$("#swupdate").hide();$("#pattern").hide();$("#reset").hide();}
    else if(name=="#sysinfo"){$("#T1").hide();$("#sysinfo").show();$("#E1").hide();$("#DS3").hide();$("#V35").hide();$("#diaequip").hide();$("#datafile").hide();$("#swupdate").hide();$("#pattern").hide();$("#reset").hide();}
    else if(name=="#e1"){$("#T1").hide();$("#sysinfo").hide();$("#E1").show();$("#DS3").hide();$("#V35").hide();$("#diaequip").hide();$("#datafile").hide();$("#swupdate").hide();$("#pattern").hide();$("#reset").hide();}
    else if(name=="#ds3"){$("#T1").hide();$("#sysinfo").hide();$("#E1").hide();$("#DS3").show();$("#V35").hide();$("#diaequip").hide();$("#datafile").hide();$("#swupdate").hide();$("#pattern").hide();$("#reset").hide();}
    else if(name=="#swupdate"){$("#T1").hide();$("#sysinfo").hide();$("#E1").hide();$("#DS3").hide();$("#V35").hide();$("#diaequip").hide();$("#datafile").hide();$("#swupdate").show();$("#pattern").hide();$("#reset").hide();}
    else if(name=="#diaeqi"){$("#T1").hide();$("#sysinfo").hide();$("#E1").hide();$("#DS3").hide();$("#V35").hide();$("#diaequip").show();$("#datafile").hide();$("#swupdate").hide();$("#pattern").hide();$("#reset").hide();}
    else if(name=="#v35"){$("#T1").hide();$("#sysinfo").hide();$("#E1").hide();$("#DS3").hide();$("#V35").show();$("#diaequip").hide();$("#datafile").hide();$("#swupdate").hide();$("#pattern").hide();$("#reset").hide();}
    else if(name=="#Datafile"){$("#T1").hide();$("#sysinfo").hide();$("#E1").hide();$("#DS3").hide();$("#V35").hide();$("#diaequip").hide();$("#datafile").show();$("#swupdate").hide();$("#pattern").hide();$("#reset").hide();}
    else if(name=="#resetlist"){$("#T1").hide();$("#sysinfo").hide();$("#E1").hide();$("#DS3").hide();$("#V35").hide();$("#diaequip").hide();$("#datafile").hide();$("#swupdate").hide();$("#pattern").hide();$("#reset").show();}
    else if(name=="#patternlist"){$("#T1").hide();$("#sysinfo").hide();$("#E1").hide();$("#DS3").hide();$("#V35").hide();$("#diaequip").hide();$("#datafile").hide();$("#swupdate").hide();$("#pattern").show();$("#reset").hide();}
}
function history_url(page,url){
    history.pushState({state:page}, null, '#'+url);
    console.log("dqwdwqd");
}
 $('#t1').click(function(){
    history_url(1,"t1");
 })

function combobox(num,array){
    $('#jqxComboBox'+num).jqxComboBox({ selectedIndex: 1, template: "primary", source: array, width: '200px', height: '20px' });
}

function printresult(data,id){  //print data in content ul
        var output = '';
        //output +='<a>' + new Date().toUTCString() +','+ data+'</a>';
        output +='<a>' + data+'</a>';
        $(output).prependTo('#'+id);
}        
function ajaxRPC(requestobject,async,callback){   //ajax
    var result=null;
    if(async!==undefined)async=false;
    var requestobject = HobbitsRPC.makeObject(requestobject,function(rsvd,res){
        console.log("ajax rpc  res data ==",res);
        result=res;
        if(callback!=undefined)callback(null,res);
    });
    
    $.ajax({
        type:"post",
        url:"/chat",
        data: {rpc:JSON.stringify(requestobject)},
        async:async,
        success:
            function(recvData){
                console.log("ajax recv data ==",recvData);
                HandlingJSONres(JSON.parse(recvData));
            },
        // beforeSend:showRequest,  
        error:function(e){alert(e.responseText);callback("ajax error!!",null);}
    });
    return result;
}



function main(){
    $("#T1").hide();$("#sysinfo").hide();$("#E1").hide();
    $("#DS3").hide();$("#V35").hide();$("#diaequip").hide();
    $("#datafile").hide();$("#swupdate").hide();
    $("#pattern").hide();$("#reset").hide();
    hideshow(window.location.hash);    
    
    $('#diaeq').click(function(){printresult(123,"fpgatest")});/////print test
    $('#weqewq').click(function(){printresult(123,"filesize")});
    //$("#T1").hide();
    $("#table").jqxDataTable({
        altRows: true,
        sortable: true,
        editable: true,
        selectionMode: 'singleRow',
        columns: [
        { text: 'Kinds', dataField: 'Kinds', width: 300 },
        { text: 'info', dataField: 'info', width: 600 }
        ]
    });
    var Collect_direction = ["TX","RX","TX/RX"];
    var datasize=["32 KB","128 KB", "사용자지정"];
    var pattern=["pattern1","pattern2","pattern3"];
    var detect=[1,2,3];
    $('#mainSplitter').jqxSplitter({ width: 800, height: 900, orientation: 'horizontal',  panels: [{ size: 500, collapsible: false }, { size: 100}] });
    $('#jqxMenu').jqxTree({ height: '100%', width: '100%' });
    $('#jqxMenu').css('visibility', 'visible');
    $('#content').jqxPanel();
    $('#table').jqxDataTable({width:"800px"});
    combobox(1,Collect_direction);combobox(2,datasize);combobox(3,pattern);combobox(4,detect);
    combobox(5,Collect_direction);combobox(6,datasize);combobox(7,pattern);combobox(8,detect);
    combobox(9,Collect_direction);combobox(10,datasize);combobox(11,pattern);combobox(12,detect);
    combobox(13,Collect_direction);combobox(14,datasize);combobox(15,pattern);combobox(16,detect);
    
    //$("#jqxComboBox1").jqxComboBox({ selectedIndex: 1, template: "primary", source: Collect_direction, width: '200px', height: '20px' });
    //$("#jqxComboBox2").jqxComboBox({ selectedIndex: 1, template: "primary", source: datasize, width: '200px', height: '20px' });
    //$("#jqxComboBox3").jqxComboBox({ selectedIndex: 1, template: "primary", source: pattern, width: '200px', height: '20px' });
    //$("#jqxComboBox4").jqxComboBox({ selectedIndex: 1, template: "primary", source: detect, width: '200px', height: '20px' });
    $('#jqxResponsivePanel').jqxResponsivePanel({
        width: '15%',
        height: '80%',
        collapseBreakpoint: 700,
        toggleButton: $('#toggleResponsivePanel'),
        animationType: 'none',
        autoClose: false
    });
    
    $('#jqxResponsivePanel').on('open expand close collapse', function (event) {
        if (event.args.element)
            return;
        var collapsed = $('#jqxResponsivePanel').jqxResponsivePanel('isCollapsed');
        var opened = $('#jqxResponsivePanel').jqxResponsivePanel('isOpened');

        if (collapsed && !opened) {
            $('#content').jqxPanel({ width: '100%' });
        }
        else if (collapsed && opened) {
            $('#content').jqxPanel({ width: '65%' });
        }
        else if (!collapsed) {
            $('#content').jqxPanel({ width: '65%' });
        }
    });

    $('#content').jqxPanel({ width: '65%', height: '80%' });
    

}