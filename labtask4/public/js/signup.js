function btn(){
    var val = document.getElementById("uname").value;
    var val1=document.getElementById("pass").value;
    var val2=document.getElementById("phone").value;
    var val3=document.getElementById("mail").value;
    
    if (val === "") {
        document.getElementById("uname").style.border = "2px solid red";
    }
    if(val1=="")
    {
        document.getElementById("pass").style.border="2px solid red"
    }
    if(val2=="")
    {
        document.getElementById("phone").style.border="2px solid red"
    }
    if(val3=="")
    {
        document.getElementById("mail").style.border="2px solid red"
    }
    }
    $(document).ready(function() {
        $("#submit").click(function() {
          alert("Login successful");
        });
      });