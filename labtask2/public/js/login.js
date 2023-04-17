function btn(){
    var val = document.getElementById("email").value;
    var val1=document.getElementById("pass").value;
    
    if (val === "") {
        document.getElementById("email").style.border = "2px solid red";
    }
    if(val1=="")
    {
        document.getElementById("pass").style.border="2px solid red"
    }
    }