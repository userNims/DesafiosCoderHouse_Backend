// ................. Importing Assets .................
const {carritos} = require('../daos/exportsDaos');
// const carrito = require('../daos/carritos/CarritosDaosArchivo');
// const producto = require('../daos/productos/ProductosDaosArchivo');

const express = require('express');
const { Router } = express;
const cartRouter = Router();

// ................. Initial Configuration .................



// ................. Routes Configuration .................
// Devuelve todos los productos
cartRouter.get('/', async (req, res) => {
    let producto = await carritos.readAllCarts();
    console.log(producto);
    res.json({producto});
});

// Muestra los productos de un carrito especifico
cartRouter.get('/:id/productos', (req,res)=>{
    let id = req.params.id;
    let carritoProductos = carritos.showCartItem(id);
    res.send(carritoProductos);
});
    
// Añade un producto a un carrito nuevo o existente
cartRouter.post('/', (req,res)=>{
    let requireProductID = req.body.idProduct;
    let requireCartID = req.body.idCarrito;
    console.log('IDDDD: ', requireProductID, requireCartID);

    carritoTemp = carrito.getById(requireCartID);

    if (carritoTemp.id) {
        carritos.addToCart(requireProductID, requireCartID);
        res.send(`ID asignado al carrito: ${requireCartID}`);
    } else {
        let carritoNuevoID = carrito.createCart();
        carritos.addToCart(requireProductID, carritoNuevoID);
        res.send(`Carrito nuevo creado con éxito, ID asignado al carrito: ${carritoNuevoID}`);
    }
});

// Añade un producto especifico a un carrito nuevo o existente
cartRouter.post('/:id/productos/:id_prod', (req,res)=>{
    let requireProductID = req.params.id_prod;
    let requireCartID = req.params.id;

    console.log('IDD: ',requireProductID, requireCartID);

    if (requireProductID && requireCartID) {
        carritos.addToCart(requireProductID, requireCartID);
        res.send(`Producto añadido al carrito con ID ${requireCartID}`);
    } else {
        let carritoNuevoID = carrito.createCart();
        carritos.addToCart(requireProductID, carritoNuevoID);
        res.send(`Carrito nuevo creado con éxito, ID asignado al carrito: ${carritoNuevoID}`);
    }
});

// Elimina un carrito por ID
cartRouter.delete('/:id', (req,res)=>{
    carritos.deleteById(req.params.id);
    res.send(carritos.getAll());
});

// Elimina el producto de un carrito
cartRouter.delete('/:id/productos/:id_prod', (req,res)=>{
    let requireProductID = req.params.id_prod;
    let requireCartID = req.params.id;
    let cartIdTemp = carritos.getById(requireCartID);
    let productIdTemp = carritos.getById(requireCartID);
    console.log('CARRITOOOOOOO: ', cartIdTemp.error);
    // Para mejorar añadir los cambios directamente a _carrito.js
    if (cartIdTemp.error || productIdTemp.error){
        res.send ( {error: 'El carrito ingresado no existe'});
    } else {
        carritos.deleteFromCart(requireProductID, requireCartID);
        res.send(carritos.getAll());
    }
});

module.exports = cartRouter;