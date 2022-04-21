const express = require('express');
const contenedor = require('./public/scripts/container.js');
const {Router} = express;
const app = express();
const PORT = 8080;
const router = Router();


app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/productos', router);
app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/public'));

/************* FIN DE LAS CONFIGURACIONES *************/

// Dirección raiz
app.get('/', function (req, res) {
    res.render('index.pug', {mensaje: 'Entregable 05'});
})

// Ingresar un producto
router.post('/',(require,response)=>{
    let agregar = require.body;
    console.log('Producto a agregar:\n',agregar);
    let newId = contenedor.save(agregar);
    response.redirect('back');
})

// Mostrar todos los productos
router.get('/',(require,response)=>{
    let array = () => contenedor.getAll();
    console.log('Todos los productos disponibles:\n',array);
    response.render('all.pug', { array: array()}); 
})

// LEVANTAR EL SERVIDOR
const server = app.listen(PORT, err => {
    if(err) throw new Error(`Error en servidor ${err}`);
    console.log("Aplicacion express escuchando en el puerto " + server.address().port);
});