console.log("Servidor iniciado...");
const path = require('path');
const socketIO = require('socket.io');
const express = require('express');

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

});




