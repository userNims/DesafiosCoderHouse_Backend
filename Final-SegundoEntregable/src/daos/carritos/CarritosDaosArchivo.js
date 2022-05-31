const Container = require('../../contenedor/ContenedorArchivo.js');
const {productos} = require('../productos/ProductosDaosArchivo');
const path = require('path');
const fs = require('fs');

function timestamp(){
    const date = new Date();
    return date.toLocaleDateString() + ' - ' + date.toLocaleTimeString(); 
}

class Carrito extends Container {
    constructor(path){
        super(path);
    }

    createCart(){
        try {
            let carrito = {};
            let createCart = this.createDocument(carrito);
            let returnOK = `Carrito con id ${createCart} creado con éxito`;
            let returnERROR = `Error al crear el carrito, ${createCart}`;
            if(typeof createCart == 'number'){
                console.log(returnOK);
                return returnOK;
            } else {
                console.log(returnERROR);
                return returnERROR;
            }
        } catch (error) {
            console.log(error);
        }
    }

    // UPDATE -> Insert an item to cart
    addToCart(idProduct, idCart){
        let productoToAdd = productos.readById(idProduct);
        let cartUpdated;
        let cartList = this.readAll();

        let auxList = [];
        cartList.forEach( carrito => {
            if(carrito.id == idCart) {
                if(carrito.listaP){
                    auxList = carrito.listaP;
                }
                let flag = true;
                auxList.forEach(producto => {
                    if (producto.id == productoToAdd.id){
                        producto.quantity += 1;
                        flag = false;
                        carrito.timestamp = timestamp();
                    }
                });

                if (flag) {
                    productoToAdd.quantity = 1;
                    if (productoToAdd.stock) {
                        delete productoToAdd.stock;
                        delete productoToAdd.timestamp;
                    }
                    auxList.push(productoToAdd);
                    carrito.timestamp = timestamp();
                }

                console.log(auxList);
                carrito = Object.assign(carrito, { listaP: auxList });
                cartUpdated = carrito;
                console.log('carrito: ', carrito); 
            }
        });

        if (productoToAdd.error){
            return productoToAdd.error;
        } else {
            try {
                this.updateById(idCart, cartUpdated);
                // fs.writeFileSync(this.path, JSON.stringify(cartList, null, 2));
                console.log(`Archivo correctamente añadido a ${this.path}`);
            } catch(error) {
                console.log('Error: no se pudo añadir el objeto al carrito.');
            }
        }
    }

    // READ -> Reading the cart
    showCart(idCart){
        let cartToShow = this.readById(idCart);
        if (cartToShow.id){
            return cartToShow;
        } else {
            console.log('Usted esta buscando un carrito que no existe.');
            return cartToShow.error;
        }
    }

    // DELETE -> Deleting an item from a cart
    deleteFromCart(idProducto, idCart){
        let cartList = this.readAll();
        let cartUpdated;
        let flagProduct = true;
        let flagNoCart = true;

        cartList.forEach( carrito => {
            if(carrito.id == idCart){
                flagNoCart = false;
                let indexProduct = carrito.listaP.findIndex(producto => producto.id == idProducto);
                if (indexProduct == -1 || carrito.listaP.length == 0){
                    flagProduct = false;
                } else {
                    carrito.listaP.forEach(producto => {
                        if(producto.id == idProducto){
                            if(producto.quantity > 1){
                                producto.quantity--;
                            } else if (producto.quantity == 1){
                                carrito.listaP.splice(indexProduct, 1);
                            } 
                            cartUpdated = carrito;
                        }
                    });
                }
                
            }
        });

        if (!flagProduct){
            console.log('Producto no disponible');
            return { error: "Producto no disponible"};
        } else if (flagNoCart){
            console.log('Producto no disponible');
            return { error: "Producto no disponible"};
        } else {
            try {
                this.updateById(idCart, cartUpdated);
                console.log(`Arhivo correctamente añadido a ${this.path}`);
                return { status: "Arhivo correctamente añadido a ${this.path}"};
            } catch(error) {
                console.log('Error: no se pudo añadir el objeto al carrito.');
                return { error: "Producto no disponible"};
            }
        }

    }

    // UPDATE -> Deleting all products from a cart
    deleteAllFromCart(idCart) {
        let cartList = this.readAll();
        let cartUpdated;
        let flagNoEntry = true;

        cartList.forEach(carrito => {
            if(carrito.id == idCart){
                carrito.listaP = [];
                cartUpdated = carrito;
                flagNoEntry = false;
            }
        })

        if (flagNoEntry) {
            console.log('Carrito no disponible');
            return { error: "Carrito no disponible"};
        } else {
            try {
                this.updateById(idCart, cartUpdated);
                console.log(`Todos los productos han sido eliminados.`);
            } catch(error) {
                console.log('Error: no se pudo borrar los objetos del carrito.');
            }
        }

    }

    // DELETE
    deleteCart(idCart){
        try {
            let retorno = this.deleteById(idCart);
            return { resultado: retorno}
        } catch (error){
            console.log(error);
            return { error: error}
        }
    }
}

let directorioJson = path.join(__dirname, '../../data/carrito.json');
let carrito = new Carrito(directorioJson);


// carrito.createCart();
// carrito.addToCart(5,5);
// carrito.showCart(100);
// carrito.deleteFromCart(5, 1);
// carrito.deleteAllFromCart(51);
carrito.deleteCart(2);


// console.log(carrito.showCartItem(16));
// carrito.deleteAllFromCart(9);
// carrito.deleteFromCart(2, 1);
// carrito.addToCart(1,1);
// carrito.addToCart(3,1);
// carrito.addToCart(2,1);
// carrito.addToCart(2,1);

module.exports = carrito;