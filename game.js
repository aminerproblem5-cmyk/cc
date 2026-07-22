// ===============================
// ADMIN COMMAND SYSTEM
// ===============================


async function runAdminCommand(){


if(role !== "admin"){

return;

}



let command =
document.getElementById("adminCommand").value;



let parts =
command.split(" ");



let output =
document.getElementById("adminResult");




// RESET CARDS

if(parts[0]==="/resetcards"){


let user=parts[1];


await fetch(

DATABASE_URL+
"users/"+user+"/cards.json",

{
method:"DELETE"
}

);



await fetch(

DATABASE_URL+
"users/"+user+"/starterClaimed.json",

{
method:"DELETE"
}

);



output.innerText=
"Cards reset for "+user;


}






// RESET MONEY


else if(parts[0]==="/resetmoney"){


let user=parts[1];


await fetch(

DATABASE_URL+
"users/"+user+"/money.json",

{

method:"PUT",

body:"0"

}

);



output.innerText=
"Money reset";


}






// DELETE PLAYER


else if(parts[0]==="/resetplayer"){


let user=parts[1];


await fetch(

DATABASE_URL+
"users/"+user+".json",

{

method:"DELETE"

}

);



output.innerText=
"Player deleted";


}







// GIVE MONEY


else if(parts[0]==="/give"){


let user=parts[1];


let amount=
Number(parts[2]);



await fetch(

DATABASE_URL+
"users/"+user+"/money.json",

{

method:"PUT",

body:amount

}

);



output.innerText=
"Gave "+amount+" CC";


}







// CREATE JOB


else if(parts[0]==="/job"){


let name=parts[1];


let reward=
Number(parts[2]);



await fetch(

DATABASE_URL+
"jobs/"+name+".json",

{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

reward:reward

})

}

);



output.innerText=
"Created job";


}







// DELETE JOB


else if(parts[0]==="/deletejob"){



await fetch(

DATABASE_URL+
"jobs/"+parts[1]+".json",

{

method:"DELETE"

}

);



output.innerText=
"Job deleted";


}







// ANNOUNCE


else if(parts[0]==="/announce"){


let msg =
parts.slice(1).join(" ");



await fetch(

DATABASE_URL+
"chat.json",

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

user:"ADMIN",

message:msg,

time:Date.now()

})

}

);



output.innerText=
"Announcement sent";


}







else{


output.innerText=
"Unknown command";


}


}