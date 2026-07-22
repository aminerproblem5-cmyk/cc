function login(){

let name =
document.getElementById("username").value;


if(name==""){
alert("Enter a username");
return;
}


localStorage.setItem(
"CCusername",
name
);


window.location="index.html";

}