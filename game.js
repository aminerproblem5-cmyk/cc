function displayCards(cards){

let box =
document.getElementById("cards");


box.innerHTML="";



cards.forEach(card=>{


let rarity =
(card.rarity || "common")
.toLowerCase()
.replace(" ","-");



box.innerHTML +=

`

<div class="ccCard rarity-${rarity}">


<h3>
${card.name}
</h3>


<p>
${card.type || "Creature"}
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
${card.rarity || "Common"}
</b>


</div>

`;


});


}