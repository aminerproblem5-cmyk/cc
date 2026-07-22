const DATABASE_URL =
"https://creature-cards-ebc02-default-rtdb.firebaseio.com/";



let username =
localStorage.getItem("CCusername");



let creatures=[

"Thorn Scout",
"Podel",
"Berd",
"Skelly",
"Sodium Carbinate",
"Aum",
"Tree Person",
"Motor Right"

];


let special=[

"Sea Biome",
"Cave Biome",
"Forest Biome",
"Power Buff"

];



async function setup(){


let data =
await fetch(
DATABASE_URL+
"users/"+username+".json"
);


let user =
await data.json();



if(!user.money){


await fetch(

DATABASE_URL+
"users/"+username+"/money.json",

{

method:"PUT",

body:100

});


}



if(!user.cards){


let pack =
generatePack();


await fetch(

DATABASE_URL+
"users/"+username+"/cards.json",

{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(pack)

});


}



load();

}




function generatePack(){


let cards=[];


// SPECIAL CHANCE


let chance =
Math.random()*100;


let specialAmount=0;


if(chance<=2){

specialAmount=4;

}

else if(chance<=7){

specialAmount=3;

}

else if(chance<=17){

specialAmount=2;

}

else if(chance<=37){

specialAmount=1;

}




for(let i=0;i<10;i++){


if(i<specialAmount){

cards.push(
special[
Math.floor(
Math.random()*special.length
)
]
);


}

else{


cards.push(
creatures[
Math.floor(
Math.random()*creatures.length
)
]
);


}


}


return cards;

}




async function openPack(){


let pack =
generatePack();



let old =
await fetch(
DATABASE_URL+
"users/"+username+"/cards.json"
);


let cards =
await old.json()
||
[];



cards =
cards.concat(pack);



await fetch(

DATABASE_URL+
"users/"+username+"/cards.json",

{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(cards)

});


load();


}




async function load(){


let data =
await fetch(

DATABASE_URL+
"users/"+username+".json"

);


let user =
await data.json();



document.getElementById("money")
.innerText=user.money || 0;



document.getElementById("cards")
.innerHTML=

(user.cards || [])
.map(x=>`<p>${x}</p>`)
.join("");

}




function battle(){

alert(
"Battle system coming next!"
);

}


function trade(){

alert(
"Trading system coming next!"
);

}



setup();