const DATABASE_URL =
"https://creature-cards-ebc02-default-rtdb.firebaseio.com/";



if(localStorage.getItem("CCrole")!="admin"){

window.location="index.html";

}




async function addCard(){


let card={

name:
document.getElementById("name").value,

type:
document.getElementById("type").value,

strength:
document.getElementById("strength").value,

speed:
document.getElementById("speed").value,

rarity:
document.getElementById("rarity").value

};



await fetch(

DATABASE_URL+
"cards/"+card.name+".json",

{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(card)

});


alert("Card added!");

}




async function loadUsers(){


let response =
await fetch(
DATABASE_URL+"users.json"
);


let users =
await response.json();


let box =
document.getElementById("users");


box.innerHTML="";


if(users){

Object.keys(users)
.forEach(user=>{


box.innerHTML +=

`
<p>
${user}
-
${users[user].role || "user"}
</p>
`;

});


}

}


loadUsers();