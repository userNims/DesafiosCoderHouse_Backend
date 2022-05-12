const express = require('express');
const contenedor = require('./public/scripts/container.js');
const handlebars = require('express-handlebars');
const {Router} = express;

const app = express();
const PORT = 8080;
const router = Router();

app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + "/views/layouts",
        partialsDir: __dirname + "/views/partials/"
    })
);

app.set('view engine', 'hbs');
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
    res.render('main');
    // res.render('main', { suggestedChamps: fakeApi(), listExists: true });   
})

// Ingresar un producto
router.post('/',(require,response)=>{
    let agregar = require.body;
    console.log('Producto a agregar:\n',agregar);
    let newId = contenedor.save(agregar);
    // response.send(`Id del producto agregado:${newId.toString()}`);
    // response.render('main');
    // paginaInicio();
    response.redirect('back');
})

// Mostrar todos los productos
router.get('/',(require,response)=>{
    let array = () => contenedor.getAll();
    console.log('Todos los productos disponibles:\n',array);
    response.render('all', { todosLosProductos: array(), listExists: true }); 
})


// LEVANTAR EL SERVIDOR
const server = app.listen(PORT, err => {
    if(err) throw new Error(`Error en servidor ${err}`);
    console.log("Aplicacion express escuchando en el puerto " + server.address().port);
});