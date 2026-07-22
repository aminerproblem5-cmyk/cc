const DATABASE_URL =
"https://creature-cards-ebc02-default-rtdb.firebaseio.com/";



async function signup(){


let username =
document.getElementById("username").value;


let password =
document.getElementById("password").value;



if(!username || !password){

message("Fill everything");

return;

}



// Prevent making another admin account

if(username==="admin"){

message("That username is reserved");

return;

}




let check =
await fetch(

DATABASE_URL+
"users/"+username+".json"

);



let exists =
await check.json();



if(exists){

message("Username already exists");

return;

}




let user={


password:password,


role:"player",


money:0,


cards:[],


starterClaimed:false


};




await fetch(

DATABASE_URL+
"users/"+username+".json",

{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(user)

}

);



message("Account created!");



}







async function login(){


let username =
document.getElementById("username").value;


let password =
document.getElementById("password").value;





// BUILT IN ADMIN LOGIN

if(
username==="admin"
&&
password==="yourpassword"

){


localStorage.setItem(
"CCusername",
"admin"
);


localStorage.setItem(
"CCrole",
"admin"
);



window.location="game.html";


return;

}





// NORMAL LOGIN


let response =
await fetch(

DATABASE_URL+
"users/"+username+".json"

);



let user =
await response.json();




if(!user){

message("Account not found");

return;

}




if(user.password!==password){

message("Wrong password");

return;

}




localStorage.setItem(
"CCusername",
username
);


localStorage.setItem(
"CCrole",
"player"
);



window.location="game.html";



}







function message(text){

document.getElementById("result")
.innerText=text;

}