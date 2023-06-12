function btn(){
    var val = document.getElementById("email").value;
   
    
    if (val === "") {
        document.getElementById("email").style.border = "2px solid red";
    }
    
    }