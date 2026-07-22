const DATABASE_URL =
"https://creature-cards-ebc02-default-rtdb.firebaseio.com/";


let username =
localStorage.getItem("CCusername");


if(!username){

window.location="login.html";

}


document.getElementById("user").innerText =
username;




async function sendMessage(){


let text =
document.getElementById("message").value;


if(text=="") return;



await fetch(
DATABASE_URL + "chat.json",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

user:username,

message:text,

time:Date.now()

})

});


document.getElementById("message").value="";


loadChat();

}





async function loadChat(){


let result =
await fetch(
DATABASE_URL+"chat.json"
);


let data =
await result.json();



let box =
document.getElementById("chatBox");


box.innerHTML="";



if(data){


Object.values(data)
.forEach(msg=>{


box.innerHTML +=

`

<div class="message">

<b>${msg.user}</b>: 
${msg.message}

</div>

`;


});


}


}



setInterval(
loadChat,
2000
);


loadChat();