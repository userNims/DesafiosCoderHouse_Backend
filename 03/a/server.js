const contenedor = require('./scripts/contenedorClase');

const express = require('express'); // importamos modulo express
const app = express();
const PORT = 8080;

app.get('/', (req, res)=>{
  res.sendFile(__dirname + "/views/main.html");
});

app.get('/productos', (req, res)=>{
  res.sendFile(__dirname + "/views/main.html");
  res.send(contenedor.getAll());
});

app.get('/productoRandom', (req, res)=>{
  let productos = contenedor.getAll();
  let randomIndex = Math.floor(Math.random() * (productos.length - 0.01));
  console.log("---------------");
  console.log("Indice " + randomIndex);
  console.log(productos.length - 1);
  
  res.send(productos[randomIndex]);
});

const server = app.listen(PORT, ()=>{
  console.log('Servidor funcionando');
});

server.on("error", error => console.log(`Error en servidor ${error}`));