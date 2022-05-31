const {mongoose} = require('mongoose');
const Container = require('../../contenedor/ContenedorMongoDB');
const productosMongoDB = require('../../daos/productos/ProductosDaosMongoDB');
const Model = require('../../models/CarritoModel');
const URL = 'mongodb+srv://test:test@cluster0.cy2mb.mongodb.net/Docebo?retryWrites=true&w=majority';

class CarritoMongoDB extends Container {
    constructor(model,url){
        super(model, url);
    }

    async createCart(){
        try {
            this.connectDBS();
            let objeto = {};
            let createCart = await this.createDocument(objeto);

            console.log(`Carrito con id ${createCart} creado con éxito`);
        } catch (error) {
            console.log(error);
        }
    }

    // UPDATE -> Insert an item to cart
    async addToCart(idProduct, idCart){
        let productoToAdd;
        let cartToUpdated;
        let flagAux = false;

        // Buscamos el objeto y el carritos necesarios mediante el ID
        try {
            productoToAdd = await productosMongoDB.read({ourID: {$eq: idProduct}}).then( result => result[0]);
            console.log("PRODUCTOOOO: ", productoToAdd);
            cartToUpdated = await this.read({ourID: {$eq: idCart}}).then( result => result[0]);
            console.log("CARRITOOOO: ", cartToUpdated);
        } catch (error) {
            console.log(error);
        }

        // Comenzamos el proceso de actualización
        let cartAux = cartToUpdated;
        try {
            if(cartToUpdated.listP){
                cartAux.listP.forEach( (element) => {
                    if(element.isbn == productoToAdd.isbn){
                        element.quantity++;
                        flagAux = true;
                    }
                });

                if(flagAux){
                    return await this.updateOneDocument({ourID: idCart}, cartAux);
                    // await this.updateOneDocument({isbn: productInTable[0].isbn}, {stock: totalStock});
                } else {
                    cartToUpdated.listP.push({
                        title: productoToAdd.title,
                        price: productoToAdd.price,
                        isbn: productoToAdd.isbn,
                        thumbnail: productoToAdd.thumbnail,
                        quantity: 1
                    })
                    return await this.updateOneDocument({ourID: idCart}, cartAux);
                }
            // Se crea la propiedad listP en caso que este no exista
            } else {
                console.log('DENTROOOOOOO');
                cartAux.listP = [
                    {
                        title: productoToAdd.title,
                        price: productoToAdd.price,
                        isbn: productoToAdd.isbn,
                        thumbnail: productoToAdd.thumbnail,
                        quantity: 1
                    }
                ]
                return await this.updateOneDocument({ourID: idCart}, cartAux);            
            }

        } catch (error) {
            console.log(error);
        }
    }

    // READ -> Reading the cart
    async showCart(idCart){
        let cartToShow = await this.read({ourID: idCart}).then( results => results[0]);
        if (cartToShow.ourID){
            console.log(cartToShow);
            return cartToShow;
        } else {
            console.log('Usted esta buscando un carrito que no existe.');
            return cartToShow.error;
        }
    }

    async readAllCarts(){
        try {
            return await this.readAllDocuments();
        } catch (error) {
            return {error: error};
        }
    }

    // UPDATE -> Deleting an item from a cart
    async deleteFromCart(idProduct, idCart){
        let productoToDelete;
        let cartToUpdated;
        let flagAux = false;

        // Buscamos el objeto y el carritos necesarios mediante el ID
        try {
            productoToDelete = await productosMongoDB.read({isbn: {$eq: idProduct}}).then( result => result[0]);
            console.log("PRODUCTOOOO TO DELETEEEEE: ", productoToDelete);
            cartToUpdated = await this.read({ourID: {$eq: idCart}}).then( result => result[0]);
            console.log("CARRITOOOO: ", cartToUpdated);
        } catch (error) {
            console.log(error);
        }

        // Comenzamos el proceso de actualización
        let cartAux = cartToUpdated;
        try {
            if(cartToUpdated.listP){
                let indexAux = cartAux.listP.findIndex(element => {
                        if(element.isbn == productoToDelete.isbn){
                            return true;
                        };
                })

                console.log('indexAux: ', indexAux);
                
                if(cartAux.listP[indexAux].quantity > 1){
                    cartAux.listP[indexAux].quantity--;
                } else if(cartAux.listP[indexAux].quantity == 1){
                    cartAux.listP.splice(indexAux, indexAux + 1);
                    console.log('cartAux: ', cartAux);
                }

                return await this.updateOneDocument({ourID: idCart}, cartAux);
            } else {
                return {error: 'El carrito no tiene productos.'};;            
            }
        } catch (error) {
            console.log(error);
        }

    }

    // UPDATE -> Deleting all products from a cart
    async deleteAllFromCart(idCart) {
        let cartToUpdated;
        let flagAux = false;

        // Buscamos el objeto y el carritos necesarios mediante el ID
        try {
            cartToUpdated = await this.read({ourID: {$eq: idCart}}).then( result => result[0]);
            console.log("CARRITOOOO: ", cartToUpdated);
        } catch (error) {
            console.log(error);
        }
        
        try {
            if(cartToUpdated.listP.length > 0) {
                cartToUpdated.listP = [];
                console.log("CARRITOOOO: ", cartToUpdated);
                console.log("El carrito está vacío");
                return await this.updateOneDocument({ourID: idCart}, cartToUpdated);
            } else {
                console.log("El carrito ya esta vacío");
            }
        } catch (error) {
            console.log(error);
        }
    }

    // DELETE
    async deleteCart(idCart){
        try {
            let retorno = await this.deleteOneDocument({ourID: idCart}).then(result => result);
            if(retorno){
                console.log('Carrito eliminado con éxito.');
            } else {
                console.log('Error al eliminar el carrito.');
            }
        } catch (error){
            console.log(error);
            return { error: error}
        }
    }
}

let carrito_01 = new CarritoMongoDB(Model, URL);

/* CONNECT TO DBS */
// carrito_01.connectDBS();

/* CREATE CART */
// carrito_01.createCart();
// carrito_01.addToCart(4);
// carrito_01.addToCart(2,2);

/* READ CART */
// carrito_01.showCart(2);

/* DELETE ITEM FROM CART */
// carrito_01.deleteFromCart(9788426728180, 2);

/* DELETE ALL FROM CART */
// carrito_01.deleteAllFromCart(2);

/* DELETE CART */
// carrito_01.deleteCart(2);

module.exports = carrito_01;