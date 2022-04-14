const express = require('express');
const contenedor = require('./scripts/container');
const api = express.Router();
const fs = require('fs');

const app = express();
const PORT = 8080;

app.use(express.json());app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api", api);

const server = app.listen(PORT, ()=>{
  console.log('Servidor funcionando');
});
server.on("error", error => console.log(`Error en servidor ${error}`));



app.get('/', (req,res)=>{
  res.sendFile(__dirname + "/views/main.html");
});

api.get('/productos', (req,res)=>{
  let productos = contenedor.getAll();
  console.log(productos);
  res.json(productos);
});

api.get('/productos/:id', (req,res)=>{
  let id = req.params.id;
  if (contenedor.getById(id)){
    res.send(contenedor.getById(id));
    
  } else {
    res.json({error: "producto no encontrado"});
  }
});

api.post('/productos', (req,res)=>{
  let addProducto = contenedor.save(req.body);
  console.log(`ID asignado al producto: ${addProducto}`);
  res.send(`ID asignado al producto: ${addProducto}`);
});

api.put('/productos/:id', (req,res)=>{
  let id = req.params.id;
  console.log("ID recibido: " + id);
  // console.log(req.body);
  let updateObject = contenedor.updateById(id, req.body);
  //console.log(updateObject);
  res.send(updateObject);
});

api.delete('/productos/:id', (req,res)=>{
  contenedor.deleteById(req.params.id);
  res.send(contenedor.getAll());
});