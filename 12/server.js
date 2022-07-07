//~~~~~~~~~~~~~ REQUIRIENDO MODULOS ~~~~~~~~~~~~~//
const express = require('express');
const session = require('express-session');
const path = require('path');
const { schema, normalize, denormalize } = require('normalizr');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy 
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser')


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

//~~~~~~~~~~~~~ VARIABLES DAOS ~~~~~~~~~~~~~//
let flag = true

//~~~~~~~~~~~~~ CONFIGURACIONES GENERALES ~~~~~~~~~~~~~//
const publicPath = path.resolve(__dirname, "./public");
const app = express();
const httpServer = new HttpServer(app);
const io = require('./routes/sockets/socket');
app.set('view engine', 'ejs');
const PORT = 8080;

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
    res.render('pages/index');
});

//* PÁGINA PRINCIPAL
app.get('/main', function (req, res) {
    res.render('pages/main',{});
});

//* LOGIN
//? Endpont de login modificado para que reaccione en función del passport
app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), (req, res) => {
    if (req.isAuthenticated()) {
        //? req.user porque es lo que devuelve el LocalStrategy con su calback en login
        res.cookie('email', req.user.id).cookie('alias', req.user.alias).redirect('/main');
    }
});
//? Nuevo endponit para ser usado por passport
app.get('/faillogin', (req, res) => { 
    res.cookie('initErr', true, { maxAge: 1000 }).redirect('/')
})

//* SIGNUP
//? Endponit de signup modificado para que reaccione a como lo determine passport
app.post('/signup', passport.authenticate('signup', { failureRedirect: '/failsignup' }), (req, res) => {
    if (req.isAuthenticated()) {
        res.cookie('alias', req.body.alias).redirect('/');
    }
})
//? Nuevo endpoint para ser usado por passport
app.get('/failsignup', (req, res) => { 
    res.cookie('registerErr', true, { maxAge: 1000 }).redirect('/')
})

//* FAIL RUTE
function error404 (require, response){
    let ruta = require.path;
    let metodo = require.method;
    let notFound = 404;
    response.status(notFound).send({error: notFound, description: `la ruta ${ruta} con método ${metodo} no tiene ninguna función implementada`});
};
app.get('*', function(require, response){
    error404(require, response);
});
app.post('*', function(require, response){
    error404(require, response);
});
app.put('*', function(require, response){
    error404(require, response);
});
app.delete('*', function(require, response){
    error404(require, response);
});


//~~~~~~~~~~~~~ DIRECTORIOS WEBSOCKET ~~~~~~~~~~~~~//
io.on('connection', websocket);


//~~~~~~~~~~~~~ LEVANTAR SERVIDOR ~~~~~~~~~~~~~//
httpServer.listen(PORT, () => {
    console.log('SERVER ON en http://localhost:8080');
});
