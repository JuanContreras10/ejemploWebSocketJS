console.log("iniciando chat");

const socket = io("http://localhost:3000/",{
    transports: ["websocket"] 
  }); // primer parametro puede ir vacio si aplica en el mismo dominio si se conecta a uno diferente 'http://etc..', segundo parametro es para no limitar las conexiones ws por cors

//componestes dom

let panelC = document.getElementById("panelC");
let btnSend = document.getElementById("send");
let btnPedido = document.getElementById("pedido");
let btnRepartidor = document.getElementById("repartidor");
let btnSocio = document.getElementById("socio");
let contenidoTabla = document.getElementById("contenidoTabla");

btnSend.addEventListener("click", function() {   
    socket.emit("servidor:api", "get");    
});
btnPedido.addEventListener("click", function() {   
    socket.emit("servidor:pedido", "pedido");    
});
btnRepartidor.addEventListener("click", function() {   
    socket.emit("servidor:pedido", "repartidor");    
});
btnSocio.addEventListener("click", function() {   
    socket.emit("servidor:pedido", "socio");    
});




socket.on("servidor:api", function (data) {   
    
 let jsonDecode = JSON.parse(data);

 
 jsonDecode.forEach(row => {
    console.log(row.gender)
    panelC.insertAdjacentHTML("beforebegin","<li>"+row.gender+"</li>")
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
