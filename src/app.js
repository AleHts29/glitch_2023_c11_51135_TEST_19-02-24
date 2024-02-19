import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewRouter from './routes/views.router.js'

import { Server } from 'socket.io'

const app = express()
const PORT = process.env.PORT || 8080;

//Preparar la configuracion del servidor para recibir objetos JSON.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Uso de vista de plantillas
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + "/views");
app.set('view engine', 'handlebars');


//Carpeta public
app.use(express.static(__dirname + '/public'));



const httpServer = app.listen(PORT, () => {
    console.log("Servidor escuchando por el puerto: " + PORT);
});


// Declaramos el router
app.use('/', viewRouter)


// const socketServer = new Server
const socketServer = new Server(httpServer);
let messages = []
// Abrimos el canal de comunicacion
socketServer.on('connection', socket => {
    // Esto lo ve cualquier user que se conecte
    socketServer.emit('messageLogs', messages)


    // aqui vamos a recibir { user: user, message: catBox.value }
    socket.on('message', data => {
        messages.push(data);
        // socket.emit('messageLogs', messages)

        // enviamos un array de objetos ---> [{ user: "Juan", message: "Hola" }, { user: "Elias", message: "Como estas?" }]
        socketServer.emit('messageLogs', messages)
    })

    // hacemos un broadcast del nuevo usuario que se conecta al chat
    socket.on('userConnected', data => {
        console.log(data);
        socket.broadcast.emit('userConnected', data.user)
    })


    // Cuando desees cerrar la conexión con este cliente en particular:
    socket.on('closeChat', data => {
        console.log(data);
        if (data.close === "close")
            socket.disconnect();
    })


})

