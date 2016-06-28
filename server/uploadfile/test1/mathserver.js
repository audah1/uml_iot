function ADDS (parameter){
     var RES =0; // responseobject.RES's value is not undefined
        for(var i= 0; i< parameter.length; i++)
        {
            RES += parameter[i];
        }
        return RES;
}
function MULS (parameter){
     var RES =1; // responseobject.RES's value is not undefined
        for(var i= 0; i< parameter.length; i++)
        {
            RES *= parameter[i];
        }
        console.log('MULS data>>>',RES);
        return RES;
}
function SUBS(parameter){
     var RES =parameter[0]; // responseobject.RES's value is not undefined
        for(var i= 1; i< parameter.length; i++)
        {
            RES -= parameter[i];
        }
        return RES;
}
function DIVS(parameter){
     var RES =parameter[0]; // responseobject.RES's value is not undefined
        for(var i= 1; i< parameter.length; i++)
        {
            RES /= parameter[i];
        }
        return RES;
}

function ADD(a,b){
    if(b==undefined /*&& a.length!==undefined*/){
        return ADDS(a);
    }
    //ADDS.apply(undefined,ADD.arguments);
    if(b==undefined)b=0;
    return a+b;//ADDS([a,b])
}
function MUL(a,b){
    if(b==undefined/* && a.length!==undefined*/){
        return MULS(a);
    }
    if(b==undefined)b=1;
    return a*b;
}
function SUB(a,b){
    if(b==undefined/* && a.length!==undefined*/){
        return a[0]-a[1];
    }
    return a-b;
}
function DIV(a,b){
    if(b==undefined/* && a.length!==undefined*/){
        return a[0]/a[1];
    }
    if(b==undefined)b=1;
    return a/b;
}

function VADD(){//return ADDS(arguments);
     var RES =0; // responseobject.RES's value is not undefined
        for(var i= 0; i< arguments.length; i++)    
        {
            RES += arguments[i];//argument 매개변수 array
        }
        return RES;
}
function VMUL(){//return MULS(arguments);
     var RES =1; // responseobject.RES's value is not undefined
        for(var i= 0; i< arguments.length; i++)
        {
            RES *= arguments[i];
        }
        return RES;
}
function VSUB(){//return SUBS(arguments);
     var RES =arguments[0]; // responseobject.RES's value is not undefined
        for(var i= 1; i< arguments.length; i++)
        {
            RES -= arguments[i];
        }
        return RES;
}
function VDIV(){//return DIVS(arguments);
     var RES =arguments[0]; // responseobject.RES's value is not undefined
        for(var i= 1; i< arguments.length; i++)
        {
            RES /= arguments[i];
        }
        return RES;
}
//ADD:ADD,MUL:MUL,SUB:SUB,DIV:DIV,ADDS:ADDS,MULS:MULS,

function register(M_on){
//M_on("SUB",SUB);M_on("-",SUB);
M_on("SUB",VSUB);M_on("-",VSUB);
//M_on("ADD",ADD);M_on("+",ADD);
M_on("ADD",VADD);M_on("+",VADD);M_on("SUM",VADD);
//M_on("DIV",DIV);M_on("/",DIV);
M_on("DIV",VDIV);M_on("/",VDIV);
//M_on("MUL",MUL);M_on("*",MUL);
M_on("MUL",VMUL);M_on("*",VMUL);
//M_on("ADDS",mathserver.ADDS);
//M_on("MULS",mathserver.MULS);
//M_on("ADDS",ADDS);
//M_on("MULS",MULS);
M_on("ADDS",VADD);
M_on("MULS",VMUL);
}

exports.register = register;
