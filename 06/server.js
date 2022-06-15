/************* INICIO DE LAS CONFIGURACIONES *************/
const express = require('express');
const contenedor = require('./modules/products/container');
const historial = require('./modules/messages/message');
const path = require('path');
const { Server: HttpServer } = require('http');
const { Server:IOServer } = require('socket.io');

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = 8080;

app.set('view engine', 'ejs');
// app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))

/************* FIN DE LAS CONFIGURACIONES *************/

let messages = contenedor.getAll();
let chatHistory = historial.allMessages();

// Levantar servidor
httpServer.listen(PORT, () => {
    console.log('SERVER ON en http://localhost:8080');
});

// Dirección raiz
app.get('/', function (req, res) {
    res.render('pages/index');
    // res.render('pages/index', {mensaje: 'Entregable 06 - WEBSOCKETS'});
});


io.on('connection', (socket) => {
    console.log('Cliente conectado');
    // console.log(messages);
    socket.emit('messages', messages);

    if (chatHistory.length > 0) {
        socket.emit('chat', chatHistory);
    } else {
        socket.emit('chat', "Chat vacio");
    }

    socket.on('new-message', data => {
        // console.log("Archivo recibido: ", data);
        contenedor.save(data)
        // messages.push(data);
        io.sockets.emit('new-messages', messages);
    })

    socket.on('chat-mensajes', data => {
        let chatGuardado = historial.allMessages;
        flag = false;
        chatGuardado.forEach(chat => {
            if(chat.author.id == data.id){
                flag = true;
                historial.addMessage(data)
            }
        })

        if(!flag){
            
        }

        console.log("Chat recibido: ", data);
        // messages.push(data);
        io.sockets.emit('chat-mensajes', chatHistory);
    })
});



// // Ingresar un producto
// router.post('/',(require,response)=>{
//     let agregar = require.body;
//     console.log('Producto a agregar:\n',agregar);
//     let newId = contenedor.save(agregar);
//     response.redirect('back');
// })

// // Mostrar todos los productos
// router.get('/',(require,response)=>{
//     let array = contenedor.getAll();
//     console.log('Todos los productos disponibles:\n',array);

//     if (array.length > 0) {
//         response.render('pages/all', { array: array}); 
//     } else {
//         response.render('pages/sinDatos'); 
//     }
// })
