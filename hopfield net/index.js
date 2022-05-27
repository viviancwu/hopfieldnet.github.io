function reveal(){
    var number = document.getElementById("memorysize").value;
    var value = number;
    sessionStorage.setItem("MemoryNum", value);

    var message = document.getElementById("errormsg");
    if(number<3){
        message.innerText = "Number must be greater than 3!";
    }
    else if(number > 10){
        message.innerText = "Number must be less than 10!";
    }
    else{
        window.location.href = "./hopfield.html";
    }
}