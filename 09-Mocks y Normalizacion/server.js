/************* INICIO DE LAS CONFIGURACIONES *************/
const express = require('express');
const contenedor = require('./modules/products/container');
const historial = require('./modules/messages/message');
const path = require('path');
const { Server: HttpServer } = require('http');
const { Server:IOServer } = require('socket.io');
const { datosArray } = require('./public/scripts/test_Faker')

const { schema, normalize, denormalize } = require('normalizr');

const publicPath = path.resolve(__dirname, "./public");
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = 8080;

//* Test Server
// const httpServerTest = new HttpServer(app);
// const ioTest = new IOServer(httpServer);

//* Normalizr Schemas
const authorSchema = new schema.Entity('authorSchema');
const messageSchema = new schema.Entity('messageSchema', {
    commenter: authorSchema
    })

const chat = new schema.Entity('chats', {
    comments: [messageSchema],
    author: authorSchema
})

app.use(express.static(publicPath));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//************* FIN DE LAS CONFIGURACIONES *************

let messages = contenedor.getAll();
let chatHistory = historial.allMessages();

let flag = true

//* Direccion para Test de Faker
app.get('/productos_test', function (req, res) {
    res.render('pages/test.ejs');
});

//* Direccion Raiz
app.get('/', function (req, res) {
    res.render('pages/index', {flag: flag});
});

//^ Verificación del ID
function checkID(){
    let allMessages = chatHistory;
    let array = [];
    allMessages.forEach( element => array.push(element.id) );
    let maxNumber = Math.max(...array) + 1;

    return maxNumber
}

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    //~ Testing products
    // console.log('datosArray', datosArray);
    socket.emit('productos', datosArray);
    
    //* Mensajes y Chat
    socket.emit('messages', messages);
    
    if (chatHistory.length > 0) {
        // console.log('NORMALIZE:', normalize(chatHistory, [chat]));
        socket.emit('chat', normalize(chatHistory, [chat]));
    } else {
        socket.emit('chat', "Chat vacio");
    }

    socket.on('new-message', data => {
        // console.log("Archivo recibido: ", data);
        contenedor.save(data)
        // messages.push(data);
        io.sockets.emit('new-messages', messages);
    })


    //^ MENSAJES DE USUARIOS EXISTENTES
    socket.on('chat-mensajes', data => {
        let mensajesTodos = historial.allMessages();
        let mensajeAux;
        flag = false;

        console.log("Chat recibido: ", data);
        // console.log("Historial: ", mensajesTodos);

        mensajesTodos.forEach(mensaje => {
            if(mensaje.author.id == data.id){
                console.log('MENSAJE', mensaje);
                mensajeAux = mensaje;
                mensajeAux.id = checkID();
                mensajeAux.text = data.message;
                flag = true;
            }
        })

        if(flag){
            historial.addMessage(mensajeAux)
            io.sockets.emit('chat', normalize(chatHistory, messageSchema));
        } else {
            console.log('El id no está registrado');
            io.sockets.emit('chat', normalize(chatHistory, messageSchema));
        }
        // messages.push(data);
    })

    socket.on('nuevo-usuario', data => {
        
        let denormalizeMessage = denormalize(data.result, messageSchema, data.entities);
        // console.log('denormalizeMessage', denormalizeMessage);

        flag = false;
        chatHistory.forEach( element => {
            if(element.author.id == denormalizeMessage.author.id){
                flag = true;
            }
        });

        // console.log(chatHistory);

        // const normalizedMessage = normalize(chatHistory, messageSchema);

        if(flag){
            io.sockets.emit('chat', normalize(chatHistory, [messageSchema]));   
        } else {
            denormalizeMessage.id = checkID();
            historial.addMessage(denormalizeMessage)
            io.sockets.emit('chat', normalize(chatHistory, [messageSchema]));
        }
    })
});


//* Levantar servidor
httpServer.listen(PORT, () => {
    console.log('SERVER ON en http://localhost:8080');
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
