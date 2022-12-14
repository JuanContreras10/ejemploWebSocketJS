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

//mensaje al servidor
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

//escuco al servidor
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


socket.on("servidor:pedido", function(data){


  
    let jsonEncode = JSON.stringify(data);  
    let jsonDecode = JSON.parse(jsonEncode);
 
    switch (jsonDecode.action) {
        case 'pedido':
           let contenido = `
           <tr>
           <th scope="row">${jsonDecode.json.pedido}</th>
           <td id="socioTd"></td>
           <td id="repartidorTd"></td>
           <td id="estado">pendiente</td>
         </tr>`;
           // console.log(jsonDecode.json.pedido)
           contenidoTabla.innerHTML = '';
           contenidoTabla.insertAdjacentHTML("afterbegin",contenido)

           
            break;
        case 'repartidor':
        let tdRepartidor = document.getElementById("repartidorTd");
        let tdEstador = document.getElementById("estado");
        let jsonDecodeRepartidor = JSON.parse(jsonDecode.json);
      
        tdRepartidor.innerHTML = "";
        tdEstador.innerHTML = "";
        jsonDecodeRepartidor.forEach(row => {
            tdRepartidor.insertAdjacentHTML("afterbegin",row.email)  
           
         });
              
        tdEstador.insertAdjacentHTML("afterbegin",jsonDecode.status)
        break;

        case 'socio':
            
        let tdSocio = document.getElementById("socioTd");
        //let tdRepartidor = document.getElementById("repartidorTd");
        let tdEstado = document.getElementById("estado");
            let jsonDecodeSocio = JSON.parse(jsonDecode.json);
           
            tdSocio.innerHTML = '';
            tdEstado.innerHTML = '';
            tdSocio.insertAdjacentHTML("afterbegin",jsonDecodeSocio.socio)          
            tdEstado.insertAdjacentHTML("afterbegin",jsonDecodeSocio.status)
            break;        
    }
});