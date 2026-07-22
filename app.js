const DATABASE_URL =
"https://creature-cards-ebc02-default-rtdb.firebaseio.com/";

let username =
localStorage.getItem("CCusername");



if(!username){

window.location="login.html";

}




// ======================
// CHAT
// ======================


async function sendMessage(){

let text =
document.getElementById("message").value;


if(text=="") return;



// ADMIN COMMAND CHECK

if(
localStorage.getItem("CCrole")
==="admin"
&& text.startsWith("/")
){

adminCommand(text);

document.getElementById("message").value="";

return;

}



await fetch(

DATABASE_URL+"chat.json",

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


let response =
await fetch(
DATABASE_URL+"chat.json"
);


let data =
await response.json();


let box =
document.getElementById("chatBox");


if(!box)return;


box.innerHTML="";


if(data){


Object.values(data)
.forEach(msg=>{


box.innerHTML+=`

<div class="message">

<b>${msg.user}</b>:
${msg.message}

</div>

`;


});


}


}


setInterval(loadChat,3000);

loadChat();





// ======================
// ADMIN COMMANDS
// ======================


async function adminCommand(command){


let parts =
command.split(" ");



//
// GIVE MONEY
//

if(parts[0]==="/give"){


let user=parts[1];

let amount=
Number(parts[2]);



await fetch(

DATABASE_URL+
"users/"+user+"/money.json",

{

method:"PUT",

body:amount

});


announce(
"Admin gave "+user+" "+amount+" CC coins"
);


}





//
// ANNOUNCE
//

if(parts[0]==="/announce"){


announce(
parts.slice(1).join(" ")
);


}





//
// CREATE JOB
//
// /job name reward
//

if(parts[0]==="/job"){


let jobName=
parts[1];


let reward=
Number(parts[2]);



await fetch(

DATABASE_URL+
"jobs/"+jobName+".json",

{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

name:jobName,

reward:reward

})

});


announce(
"New job created: "+jobName+
" pays "+reward
);


}





//
// DELETE JOB
//

if(parts[0]==="/deletejob"){


await fetch(

DATABASE_URL+
"jobs/"+parts[1]+".json",

{

method:"DELETE"

});


}



}





async function announce(message){


await fetch(

DATABASE_URL+"chat.json",

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

user:"ADMIN",

message:message,

time:Date.now()

})

});


}






// ======================
// MONEY
// ======================



async function getMoney(){


let response =
await fetch(

DATABASE_URL+
"users/"+username+"/money.json"

);


let money =
await response.json();


return money || 0;


}




async function addMoney(amount){


let money =
await getMoney();


await fetch(

DATABASE_URL+
"users/"+username+"/money.json",

{

method:"PUT",

body:money+amount

}

);


}







// ======================
// JOB SYSTEM
// ======================



async function showJobs(){


let response =
await fetch(

DATABASE_URL+
"jobs.json"

);


let jobs =
await response.json();


let box =
document.getElementById("jobs");


if(!box)return;


box.innerHTML="";



if(jobs){


Object.keys(jobs)
.forEach(job=>{


box.innerHTML+=`

<div class="card">

<h3>
${jobs[job].name}
</h3>

<p>
Reward:
${jobs[job].reward}
CC
</p>


<button onclick="doJob('${job}')">

Complete Job

</button>


</div>

`;



});


}



}





async function doJob(job){



let response =
await fetch(

DATABASE_URL+
"jobs/"+job+".json"

);


let data =
await response.json();



if(!data)return;



await addMoney(
data.reward
);



await fetch(

DATABASE_URL+
"users/"+username+
"/completedJobs/"+job+".json",

{

method:"PUT",

body:"true"

}

);



alert(
"Completed job! +" 
+data.reward+
" CC"
);



}





showJobs();