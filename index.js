console.log("Servidor iniciado...");
const path = require('path');
const socketIO = require('socket.io');
const express = require('express');
const fetch = require('node-fetch');

const app = express();

//config
app.set('port', process.env.PORT || 3000);

const port = app.get('port');

const server = app.listen(port,() => {
    console.log("-Servidor en puerto: " + port + "...");    
});  

//static files
app.use(express.static(path.join(__dirname, "public")));




//websocket connection
const io = socketIO(server);
io.on('connection',(socket)=>{
    console.log("Nueva entrada: " + socket.id);
    socket.on("chat:message", (data) => {
        console.log("trasmitiendo...");
        io.sockets.emit("chat:message", data);
    });
    socket.on("chat:typing", (data) => {
     
        console.log("typing "+data+"...");
        socket.broadcast.emit("chat:typing", data);
    });
    socket.on("servidor:api", (data) => {
         
        console.log("transmitiendo "+data+"...");
        let options = {
            method: 'GET',
          
          };
          let url = 'https://randomuser.me/api/';
          fetch(url, options)
            .then(res => res.json())
            .then(json => {
                console.log("redirijir "+data+"...");               
               let jso = JSON.stringify(json.results);  
                 io.sockets.emit("servidor:api",jso);
             })
            .catch(err => console.error('error:' + err));
    });
    socket.on("servidor:pedido", (data) => {
        switch (data) {
            case 'pedido':
                console.log("transmitiendo "+data+"...");
                let jsonContenido = { 
                    pedido:  Math.floor(Math.random() *10),
                   
                };
                
                io.sockets.emit("servidor:pedido",{
                    json: jsonContenido,
                    action: data
                });
                break;
            case 'repartidor':
                console.log("transmitiendo "+data+"...");
                let options = {
                    method: 'GET',
                  
                  };
                  let url = 'https://randomuser.me/api/';
                  fetch(url, options)
                    .then(res => res.json())
                    .then(json => {
                                     
                       let jso = JSON.stringify(json.results);  
                         io.sockets.emit("servidor:pedido",{
                            json: jso,
                            action: data,
                            status: "tomado/entregado"
                        });
                     })
                    .catch(err => console.error('error:' + err));
                break;
            case 'socio':
                console.log("transmitiendo "+data+"...");
                let js = JSON.stringify({ 
                    socio:  "dinoburger_"+ Math.floor(Math.random() *10),
                    status: "liberado"

                   
                });  
                io.sockets.emit("servidor:pedido",{
                    json: js,
                    action: data
                });
                break;        
        }


    });

});




