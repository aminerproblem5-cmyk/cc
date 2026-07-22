const DATABASE_URL =
"https://creature-cards-ebc02-default-rtdb.firebaseio.com/";


async function signup(){

let username =
document.getElementById("username").value;

let password =
document.getElementById("password").value;


if(username=="" || password==""){
alert("Fill in everything");
return;
}


let check =
await fetch(
DATABASE_URL+"users/"+username+".json"
);


let exists =
await check.json();


if(exists){

document.getElementById("status").innerText =
"Username already exists";

return;

}



await fetch(
DATABASE_URL+"users/"+username+".json",
{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

password:password

})

});


localStorage.setItem(
"CCusername",
username
);


window.location="index.html";

}





async function login(){

let username =
document.getElementById("username").value;


let password =
document.getElementById("password").value;



let response =
await fetch(
DATABASE_URL+"users/"+username+".json"
);


let user =
await response.json();



if(!user){

document.getElementById("status").innerText =
"Account does not exist";

return;

}



if(user.password === password){


localStorage.setItem(
"CCusername",
username
);


window.location="index.html";


}

else{


document.getElementById("status").innerText =
"Wrong password";


}


}