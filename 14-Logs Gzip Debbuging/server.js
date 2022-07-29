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

//~~~~~~~~~~~~~ IMPORTACION DE LOS DAOS ~~~~~~~~~~~~~//
const contenedor = require('./modules/products/container');
const historial = require('./modules/messages/message');
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}

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

//* Inicializa Middleware de passport
app.use(passport.initialize());
//* Inicializa la session de passport
app.use(passport.session());
//* Registrar la ruta login en passport
passport.use('login',new LocalStrategy(
    async (username, password, callback) => {
        let user = await usuarioDaos.readUser(username)
        if(user.error) {
            return callback(user.error) //* fallo de búsqueda
        } else {
            if(!validatePass(user, password)){
                return callback(null, false) //* password incorrecto
            } else {
                return callback(null, user) //* devuelve el usuario
            }
        }
    }
));
//* Registrar la ruta signup en passport
passport.use('signup', new LocalStrategy(
    //* le digo que quiero recibir el req y que se pase como parametro
    {passReqToCallback: true}, async (req, username, password, callback) => {
        const newUser = {
            id: username,
            password: createHash(password),
            name: req.body.name,
            lastname: req.body.lastname,
            age: req.body.age,
            alias: req.body.alias,
            avatar: req.body.avatar
        }
        let userStatus = await usuarioDaos.createUser(newUser);
        if (userStatus.found){
            return callback(null, false)
        } else {
            return callback(null, newUser)
        }
    }
))

//* passport necesita serializar...
passport.serializeUser((user, callback) => {
    callback(null, user.id) //* se pasa id porque es único en la DB
})
passport.deserializeUser(async (id, callback) => {
    let user = await usuarioDaos.readUser(id); //* se busca en la DB por id
    callback (null, user)
})


//~~~~~~~~~~~~~ DIRECTORIOS HTTP ~~~~~~~~~~~~~//
//* DIRECCION RAIZ
app.get('/', function (req, res) {
    loggerInfo.info(`Ruta: ${req.originalUrl}, Metodo: ${req.method}`);
    res.render('pages/index');
});

//* PÁGINA PRINCIPAL
app.get('/main', function (req, res) {
    loggerInfo.info(`Ruta: ${req.originalUrl}, Metodo: ${req.method}`);
    res.render('pages/main',{});
});

//* LOGIN
//? Endpont de login modificado para que reaccione en función del passport
app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), (req, res) => {
    loggerInfo.info(`Ruta: ${req.originalUrl}, Metodo: ${req.method}`);
    if (req.isAuthenticated()) {
        //? req.user porque es lo que devuelve el LocalStrategy con su calback en login
        res.cookie('email', req.user.id).cookie('alias', req.user.alias).redirect('/main');
    }
});
//? Nuevo endponit para ser usado por passport
app.get('/faillogin', (req, res) => { 
    loggerInfo.info(`Ruta: ${req.originalUrl}, Metodo: ${req.method}`);
    res.cookie('initErr', true, { maxAge: 1000 }).redirect('/')
})

//* SIGNUP
//? Endponit de signup modificado para que reaccione a como lo determine passport
app.post('/signup', passport.authenticate('signup', { failureRedirect: '/failsignup' }), (req, res) => {
    loggerInfo.info(`Ruta: ${req.originalUrl}, Metodo: ${req.method}`);
    if (req.isAuthenticated()) {
        res.cookie('alias', req.body.alias).redirect('/');
    }
})
//? Nuevo endpoint para ser usado por passport
app.get('/failsignup', (req, res) => { 
    loggerInfo.info(`Ruta: ${req.originalUrl}, Metodo: ${req.method}`);
    res.cookie('registerErr', true, { maxAge: 1000 }).redirect('/')
})

//* INFO PAGE
app.get('/info', compression(), (req, res) => {
    loggerInfo.info(`Ruta: ${req.originalUrl}, Metodo: ${req.method}`);
    let info = {
        os: process.platform,
        nodeVersion: process.version,
        memory: process.memoryUsage,
        cwd: process.cwd(),
        idProcess: process.pid,
        execPath: process.execPath
    };
    res.send(info);
});

//* RANDOM NUMBER GENERATOR
app.get('/api/randoms', (req,res) => {
    loggerInfo.info(`Ruta: ${req.originalUrl}, Metodo: ${req.method}`);
    const number = req.query.cant
    console.log(number);
    console.log("Running main.js");
    console.log("Forking a new subprocess....");

    const child = fork('./src/utils/randomNumber.js');
    child.send(number);

    child.on("message", function (message) {
        console.log(`Message from child.js: ${message}`);
        res.send(`${message}`);
    });

    // res.send('Not ready');
});

//* FAIL RUTE
function error404 (require, response){
    let ruta = require.path;
    let metodo = require.method;
    let notFound = 404;
    response.status(notFound).send({error: notFound, description: `la ruta ${ruta} con método ${metodo} no tiene ninguna función implementada`});
};
app.get('*', function(require, response){
    loggerWarn.warn(`Ruta: ${require.originalUrl}, Metodo: ${require.method}`);
    error404(require, response);
});
app.post('*', function(require, response){
    loggerWarn.warn(`Ruta: ${require.originalUrl}, Metodo: ${require.method}`);
    error404(require, response);
});
app.put('*', function(require, response){
    loggerWarn.warn(`Ruta: ${require.originalUrl}, Metodo: ${require.method}`);
    error404(require, response);
});
app.delete('*', function(require, response){
    loggerWarn.warn(`Ruta: ${require.originalUrl}, Metodo: ${require.method}`);
    error404(require, response);
});


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
