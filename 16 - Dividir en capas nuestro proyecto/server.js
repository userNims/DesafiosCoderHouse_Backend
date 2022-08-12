//~~~~~~~~~~~~~ REQUIRIENDO MODULOS ~~~~~~~~~~~~~//
const express = require('express');
const session = require('express-session');
const path = require('path');
const { Server: HttpServer } = require('http');
const { Server:IOServer } = require('socket.io');
const { schema, normalize, denormalize } = require('normalizr');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy 
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser')
const compression = require('compression');
const log4js = require('log4js');

//~~~~~~~~~~~~~ IMPORTACION DE LOS DAOS Y UTILS~~~~~~~~~~~~~//
const productoDaos = require('./src/mongo/productoDaosMongoDB');
const mensajeDaos = require('./src/mongo/mensajeDaosMongoDB');
const usuarioDaos = require('./src/mongo/usuarioDaosMongoDB');
const {validatePass} = require('./src/utils/passValidator');
const {createHash} = require('./src/utils/hashGenerator');
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}

const webRoutes = require("./src/routes/webRoutes");

//~~~~~~~~~~~~~ FORK Y DOTENV ~~~~~~~~~~~~~//
const { fork } = require('child_process');
require("dotenv").config();
const URL = process.env.MongoDB;
console.log("🚀 ~ file: server.js ~ line 5 ~ URL", URL)

//~~~~~~~~~~~~~ VARIABLES DAOS ~~~~~~~~~~~~~//
let flag = true

//~~~~~~~~~~~~~ CONFIGURACIONES GENERALES ~~~~~~~~~~~~~//
const publicPath = path.resolve(__dirname, "./public");
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
app.set('view engine', 'ejs');
const PORT = 8080;

log4js.configure({
    appenders: {
        miLoggerConsole: {type: "console"},
        miLoggerFile_Warn: {type: "file", filename: 'warn.log'},
        miLoggerFile_Error: {type: "file", filename: 'error.log'}
    },
    categories: {
        default: {appenders: ["miLoggerConsole"], level: "info"},
        warn: {appenders: ["miLoggerFile_Warn", "miLoggerConsole"], level: "warn"},
        error: {appenders: ["miLoggerFile_Error", "miLoggerConsole"], level: "error"}
    }
});
const loggerInfo = log4js.getLogger('default');
const loggerWarn = log4js.getLogger('warn');
const loggerError = log4js.getLogger('error');

//~~~~~~~~~~~~~ SCHEMAS ~~~~~~~~~~~~~//
const authorSchema = new schema.Entity('authorSchema');
const messageSchema = new schema.Entity('messageSchema', {
    commenter: authorSchema
});
const chat = new schema.Entity('chats', {
    comments: [messageSchema],
    author: authorSchema
})

//~~~~~~~~~~~~~ MIDDLEWARES ~~~~~~~~~~~~~//
app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
    store: MongoStore.create({ 
        mongoUrl: 'mongodb+srv://test:test@cluster0.cy2mb.mongodb.net/school_store?retryWrites=true&w=majority',
        mongoOptions: advancedOptions
    }),
    secret: 'nims360',
    cookie: {
        maxAge: 5000,
        httpOnly: false,
        secure: false
    },
    //rolling: true,
    resave: false,
    saveUninitialized: false
}))

//~~~~~~~~~~~~~ DIRECTORIOS HTTP ~~~~~~~~~~~~~//
//* DIRECCION RAIZ
app.use("/", webRoutes);


//~~~~~~~~~~~~~ DIRECTORIOS WEBSOCKET ~~~~~~~~~~~~~//
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

//*
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
