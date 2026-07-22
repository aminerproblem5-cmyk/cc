const DATABASE_URL =
"https://creature-cards-ebc02-default-rtdb.firebaseio.com/";



const username =
localStorage.getItem("CCusername");


const role =
localStorage.getItem("CCrole");



if(!username){

window.location="login.html";

}




document.getElementById("username").innerText =
username;





// ============================
// CARD DATABASE
// ============================


const creatures = [

{
name:"Thorn Scout",
type:"Nature",
strength:150,
diet:"Poison",
speed:200,
height:"2m",
danger:"6/10",
rarity:"Rare"
},

{
name:"Podel",
type:"Normal",
strength:"Rock",
diet:"Fish from ponds",
speed:30,
height:"0.7m",
danger:"5/10",
rarity:"Secret"
},

{
name:"Berd",
type:"Flying",
strength:500,
diet:"Rats",
speed:300,
height:"3m",
danger:"6/10",
rarity:"Obstratick"
},

{
name:"Skelly",
type:"Undead",
strength:400,
diet:"Nothing",
speed:150,
height:"2.3m",
danger:"5/10",
rarity:"Rare"
},

{
name:"Sodium Carbinate",
type:"Carbonate",
strength:50,
diet:"Bone marrow",
speed:230,
height:"5cm",
danger:"4/10",
rarity:"Uncommon"
},

{
name:"Aum",
type:"Bug",
strength:300,
diet:"Anything",
speed:30,
height:"10cm",
danger:"5/10",
rarity:"Uncommon"
},

{
name:"Tree Person",
type:"Flying",
strength:400,
diet:"Air",
speed:300,
height:"18.5m",
danger:"7/10",
rarity:"Legendary"
},

{
name:"Motor Right",
type:"Rock",
strength:0,
diet:"Nothing",
speed:1.3,
height:"1.3m",
danger:"0/10",
rarity:"Common"
}

];





const specials=[

{
name:"Sea Biome",
type:"Biome",
rarity:"Rare"
},

{
name:"Cave Biome",
type:"Biome",
rarity:"Legendary"
},

{
name:"Power Buff",
type:"Buff",
rarity:"Mythical"
}

];





// ============================
// DATABASE
// ============================



async function getUser(){


let response =
await fetch(

DATABASE_URL+
"users/"+username+".json"

);


return await response.json() || {};

}




async function updateUser(data){


await fetch(

DATABASE_URL+
"users/"+username+".json",

{

method:"PATCH",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(data)

}

);


}





// ============================
// LOAD GAME
// ============================


async function loadGame(){


let user =
await getUser();



if(user.money===undefined){

user.money=0;

await updateUser(user);

}



document.getElementById("money")
.innerText =
user.money;



showCards(
user.cards || []
);



loadJobs();


}




// ============================
// PACKS
// ============================


function createPack(){


let cards=[];


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
specials[
Math.floor(
Math.random()*specials.length
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





async function claimStarter(){


let user =
await getUser();



if(user.starterClaimed){


alert(
"You already claimed your free pack!"
);


return;

}



user.cards =
user.cards || [];



user.cards.push(
...createPack()
);



user.starterClaimed=true;



await updateUser(user);


loadGame();


alert(
"Starter pack opened!"
);


}





async function buyPack(){


let user =
await getUser();



if(user.money <100){


alert(
"You need 100 CC"
);


return;

}



user.money-=100;


user.cards =
user.cards || [];



user.cards.push(
...createPack()
);



await updateUser(user);


loadGame();


}






// ============================
// DISPLAY CARDS
// ============================



function showCards(cards){


let box =
document.getElementById("cards");


box.innerHTML="";



if(cards.length===0){


box.innerHTML=
"<p>No cards yet!</p>";


return;

}





cards.forEach(card=>{


// OLD CARD FORMAT

if(typeof card==="string"){


box.innerHTML+=`

<div class="ccCard common">

<div class="cardPicture"></div>

<h3>${card}</h3>

<p>
Creature
</p>

<b>
Common
</b>

</div>

`;


return;

}




let rarity =
(card.rarity || "Common")
.toLowerCase();



box.innerHTML+=`

<div class="ccCard ${rarity}">


<div class="cardPicture"></div>


<h3>
${card.name}
</h3>


<p class="ccStat">
Type:
${card.type || "-"}
</p>


<p class="ccStat">
STR:
${card.strength || "-"}
</p>


<p class="ccStat">
SPD:
${card.speed || "-"}
</p>


<p class="ccStat">
${card.rarity || "Common"}
</p>


</div>

`;



});


}






// ============================
// JOB SYSTEM
// ============================



async function loadJobs(){


let response =
await fetch(

DATABASE_URL+
"jobs.json"

);


let jobs =
await response.json();



let box =
document.getElementById("jobs");



box.innerHTML="";



if(!jobs){


box.innerHTML=
"<p>No jobs available</p>";


return;

}




Object.keys(jobs)
.forEach(job=>{


box.innerHTML+=`

<div class="jobCard">

<h3>
${job}
</h3>


<p>
Reward:
${jobs[job].reward} CC
</p>


<button onclick="completeJob('${job}')">

Complete

</button>


</div>

`;


});


}





async function completeJob(job){


let response =
await fetch(

DATABASE_URL+
"jobs/"+job+".json"

);


let data =
await response.json();



if(!data)return;



let user =
await getUser();



user.money =
(user.money || 0)
+
Number(data.reward);



await updateUser(user);



alert(
"Job complete! +" 
+data.reward+
" CC"
);



loadGame();


}







// ============================
// ADMIN JOB CREATION
// ============================



async function createJob(){


if(role!=="admin"){

return;

}



let name =
document.getElementById("newJob").value;


let reward =
Number(
document.getElementById("newReward").value
);



if(!name || !reward){

alert(
"Fill in job details"
);

return;

}




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



alert(
"Job created"
);



loadJobs();


}




loadGame();