// ................. Variable de Entorno .................
const dbType = 'mongodb';
// const dbType = 'firebase';
// const dbType = 'jsonfiles';
module.exports = dbType;

// ................. Importing Assets .................
const productRouter = require('./src/routes/productosRutas.js');
const cartRouter = require('./src/routes/carritoRutas.js');
const path = require('path');
const fs = require('fs');

// Admin JSON
let directorioJson = path.join(__dirname, 'src/data/user.json');
let adminJSON = JSON.parse(fs.readFileSync(directorioJson, 'utf-8'));
console.log(adminJSON);

const express = require('express');
const app = express();

// ................. Initial Configuration .................
// Credentials
let admin = false;
let user = "nims";
let pass = 36099;


const PORT = 8080;
app.use(express.json());app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Definicion de las rutas
app.use('/api/producto', productRouter);
app.use('/api/carrito', cartRouter);

// ................. Server Configuration .................
const server = app.listen(PORT, ()=>{
  console.log('Servidor funcionando');
});
server.on("error", error => console.log(`Error en servidor ${error}`));

app.get('/', (req,res)=>{
  res.sendFile(__dirname + "/views/main.html");
});

app.get('/login', (req, res)=>{
  console.log(req.body.user, req.body.pass);
  if (req.body.user == user && req.body.pass == pass){
    adminJSON.admin = true;
    fs.writeFileSync(directorioJson, JSON.stringify(adminJSON, null, 2));
    res.send('Sesión Iniciada');
  }
  res.send('Error al iniciar sesión');
});

app.get('/logout', (req, res)=>{
  adminJSON.admin = false;
  fs.writeFileSync(directorioJson, JSON.stringify(adminJSON, null, 2));
  res.send('Sesión terminada');
});

// api/productos
// productRouter.get('/', (req,res)=>{
//   let productos = contenedor.getAll();
//   console.log(productos);
//   res.json(productos);
// });
// console.log('ADMINNNNN: ', admin);
// module.exports = admin;