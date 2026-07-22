const DATABASE_URL =
"https://creature-cards-ebc02-default-rtdb.firebaseio.com/";


const username =
localStorage.getItem("CCusername");


const role =
localStorage.getItem("CCrole");



document.getElementById("username").innerText =
username || "Guest";



if(role !== "admin"){

document.getElementById("adminPanel").style.display="none";

}




const creatures = [

{
name:"Thorn Scout",
type:"Nature",
strength:150,
speed:200,
rarity:"Rare"
},

{
name:"Podel",
type:"Normal",
strength:"Rock",
speed:30,
rarity:"Secret"
},

{
name:"Berd",
type:"Flying",
strength:500,
speed:300,
rarity:"Obstratick"
},

{
name:"Skelly",
type:"Undead",
strength:400,
speed:150,
rarity:"Rare"
},

{
name:"Sodium Carbinate",
type:"Carbonate",
strength:50,
speed:230,
rarity:"Uncommon"
},

{
name:"Aum",
type:"Bug",
strength:300,
speed:30,
rarity:"Uncommon"
},

{
name:"Tree Person",
type:"Flying",
strength:400,
speed:300,
rarity:"Legendary"
},

{
name:"Motor Right",
type:"Rock",
strength:0,
speed:1.3,
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





async function getUser(){


let r =
await fetch(
DATABASE_URL+
"users/"+username+".json"
);


return await r.json() || {};

}




async function saveUser(data){


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





async function load(){


let user =
await getUser();



if(user.money===undefined){

user.money=0;

await saveUser(user);

}



document.getElementById("money")
.innerText=user.money;



showCards(user.cards || []);


loadJobs();


}





function randomCard(){


return creatures[
Math.floor(
Math.random()*creatures.length
)
];


}





function makePack(){


let pack=[];


let roll =
Math.random()*100;


let specialAmount=0;


if(roll<=2)
specialAmount=4;

else if(roll<=7)
specialAmount=3;

else if(roll<=17)
specialAmount=2;

else if(roll<=37)
specialAmount=1;



for(let i=0;i<10;i++){


if(i<specialAmount){

pack.push(
specials[
Math.floor(
Math.random()*specials.length
)
]
);

}

else{

pack.push(
randomCard()
);

}


}


return pack;

}





async function claimStarter(){


let user =
await getUser();



if(user.starterClaimed){

alert(
"You already claimed it!"
);

return;

}



let cards =
user.cards || [];


cards.push(
...makePack()
);



user.cards=cards;

user.starterClaimed=true;


await saveUser(user);


showCards(cards);


}





async function buyPack(){


let user =
await getUser();



if(user.money <100){

alert(
"Need 100 CC"
);

return;

}



user.money-=100;


user.cards =
user.cards || [];


user.cards.push(
...makePack()
);



await saveUser(user);


load();


}






function showCards(cards){


let box =
document.getElementById("cards");


box.innerHTML="";



cards.forEach(card=>{


let rarity =
card.rarity
.toLowerCase();



box.innerHTML += `


<div class="ccCard ${rarity}">


<h3>
${card.name}
</h3>


<p>
${card.type}
</p>


<p>
STR:
${card.strength || "-"}
</p>


<p>
SPD:
${card.speed || "-"}
</p>


<b>
${card.rarity}
</b>


</div>


`;


});


}







async function createJob(){


let name =
document.getElementById("newJob").value;


let reward =
Number(
document.getElementById("newReward").value
);



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


loadJobs();


}





async function loadJobs(){


let r =
await fetch(

DATABASE_URL+
"jobs.json"

);


let jobs =
await r.json();



let box =
document.getElementById("jobs");


box.innerHTML="";



if(!jobs)return;



Object.keys(jobs)
.forEach(job=>{


box.innerHTML+=`

<div class="card">

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


let user =
await getUser();



let r =
await fetch(

DATABASE_URL+
"jobs/"+job+".json"

);


let data =
await r.json();



user.money =
(user.money || 0)
+
data.reward;



await saveUser(user);


load();


}





load();