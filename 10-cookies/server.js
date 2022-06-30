//~~~~~~~~~~~~~ IMPORTACION DE LOS DAOS ~~~~~~~~~~~~~//
const productoDaos = require('./src/mongo/productoDaosMongoDB');
const mensajeDaos = require('./src/mongo/mensajeDaosMongoDB');
const usuarioDaos = require('./src/mongo/usuarioDaosMongoDB');


//~~~~~~~~~~~~~ REQUIRIENDO MODULOS ~~~~~~~~~~~~~//
const express = require('express');
const session = require('express-session');


//~~~~~~~~~~~~~ INICIO DE LAS CONFIGURACIONES ~~~~~~~~~~~~~//
const contenedor = require('./modules/products/container');
const historial = require('./modules/messages/message');
const path = require('path');

const { Server: HttpServer } = require('http');
const { Server:IOServer } = require('socket.io');
const { schema, normalize, denormalize } = require('normalizr');

const publicPath = path.resolve(__dirname, "./public");
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = 8080;


//* Normalizr Schemas
const authorSchema = new schema.Entity('authorSchema');
const messageSchema = new schema.Entity('messageSchema', {
    commenter: authorSchema
});

const chat = new schema.Entity('chats', {
    comments: [messageSchema],
    author: authorSchema
})

app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//~~~~~~~~~~~~~ VARIABLES DAOS ~~~~~~~~~~~~~//
let flag = true

//* DIRECCION RAIZ
app.get('/', function (req, res) {
    res.render('pages/index');
});


io.on('connection', async (socket, resSocket) => {
    // console.log(socket);
    // console.log(socket.cookies); // works in websocket node
    // resSocket.cookies('server2', 'CookieXD')
    console.log('Cliente conectado');
    
    //************** PRODUCTOS **************//
    let productos = await productoDaos.readAllProducts().then( products => {
        return products;
    });
    // console.log(productos);

    
    socket.emit('productos', productos);
    
    
    //************** MENSAJES **************//
    let mensajes = await mensajeDaos.readAllMessages().then( messages => {
        return messages;
    });

    if (mensajes.length > 0) {
        // console.log('NORMALIZE:', normalize(mensajes, [chat]));
        socket.emit('chat', normalize(mensajes, [chat]));
    } else {
        socket.emit('chat', "Chat vacio");
    }

    socket.on('new-product', async data => {
        await productoDaos.createProduct(data);
        let productos = await productoDaos.readAllProducts().then( products => {
            return products;
        });
        io.sockets.emit('productos', productos);
    })

//&
    //^ MENSAJES DE USUARIOS EXISTENTES
    socket.on('chat-mensajes', data => {
        let mensajesTodos = historial.allMessages();
        let mensajeAux;
        flag = false;

        console.log("Chat recibido: ", data);

        mensajesTodos.forEach(mensaje => {
            if(mensaje.author.id == data.id){
                console.log('MENSAJE', mensaje);
                mensajeAux = mensaje;
                // mensajeAux.id = checkID();
                mensajeAux.text = data.message;
                flag = true;
            }
        })

        if(flag){
            historial.addMessage(mensajeAux)
            io.sockets.emit('chat', normalize(mensajes, messageSchema));
        } else {
            console.log('El id no está registrado');
            io.sockets.emit('chat', normalize(mensajes, messageSchema));
        }
        // messages.push(data);
    })


    //* VERIFICAR USUARIO REGISTRADO
    socket.on('init-session', async data => {
        let usuario = await usuarioDaos.readUser(data);
        console.log(usuario);
        if(usuario.error){
            io.sockets.emit('res-session', usuario);
        } else {
            await usuarioDaos.updateUserSession(usuario.id, {session: true});
            io.sockets.emit('res-session', usuario);
        }
    })


    //* CLOSE SESSION
    socket.on('close-session', async data => {
        let usuario = await usuarioDaos.readUser(data);
        console.log(usuario);
        await usuarioDaos.updateUserSession(usuario.id, {session: false});
    });



    socket.on('nuevo-usuario', data => {
        
        let denormalizeMessage = denormalize(data.result, messageSchema, data.entities);
        // console.log('denormalizeMessage', denormalizeMessage);

        flag = false;
        mensajes.forEach( element => {
            if(element.author.id == denormalizeMessage.author.id){
                flag = true;
            }
        });

        // console.log(mensajes);

        // const normalizedMessage = normalize(mensajes, messageSchema);

        if(flag){
            io.sockets.emit('chat', normalize(mensajes, [messageSchema]));   
        } else {
            // denormalizeMessage.id = checkID();
            historial.addMessage(denormalizeMessage)
            io.sockets.emit('chat', normalize(mensajes, [messageSchema]));
        }
    })

    //^ RECIEVE INFO FROM THE COOKIES USER
    socket.on('session-statusSend', async data => {
        let usuario = await usuarioDaos.readUser(data);
        console.log('OOOOOOOOOOOOOOO');
        console.log('usuario', usuario);
        io.sockets.emit('session-statusRecieved', usuario);
    });
});


//~~~~~~~~~~~~~ LEVANTAR SERVIDOR ~~~~~~~~~~~~~//
httpServer.listen(PORT, () => {
    console.log('SERVER ON en http://localhost:8080');
});
