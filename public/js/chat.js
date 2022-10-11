console.log("iniciando chat");
const socket = io(); //solo aplica en el mismo dominio si se conecta auno diferente 'http://etc..'

//componestes dom
let message = document.getElementById("message");
let user = document.getElementById("user");
let actions = document.getElementById("actions");
let outputs = document.getElementById("outputs");
let btnSend = document.getElementById("send");
let inputGenero = document.getElementById("genero");
let btnApi = document.getElementById("api");

btnSend.addEventListener("click", function() {

   
    socket.emit("chat:message", {
        user: user.value,
        message: message.value
    });
    
});

btnApi.addEventListener("click", function() {

    console.log("click")
    socket.emit("servidor:api", "get");
    
});

message.addEventListener("keypress", function(){  
    socket.emit("chat:typing", user.value);
});

socket.on("chat:message", function (data) {
    actions.innerHTML = '';
    outputs.innerHTML += `<p>
    <strong>${data.user}</strong>: ${data.message}
    </p>`;


});

socket.on("chat:typing", function (data) {   
    actions.innerHTML = `<p><em>
    ${data} esta escribiendo...
    </em></p>`;
   


});

socket.on("servidor:api", function (data) {   
    
 let jsonDecode = JSON.parse(data);

 
 jsonDecode.forEach(row => {
    console.log(row.gender)
    inputGenero.insertAdjacentHTML("beforebegin","<li>"+row.gender+"</li>")
 });

});