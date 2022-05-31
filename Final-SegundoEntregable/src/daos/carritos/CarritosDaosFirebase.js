const ProductosFirebase = require('../productos/ProductosDaosFirebase')
const ContenedorFirebase = require('../../contenedor/ContenedorFirebase');
let admin = require("firebase-admin");
let serviceAccount = require("../../data/proyectofinal-docebo-firebase-adminsdk-tpc35-4d3342a41a.json");

class CarritosFirebase extends ContenedorFirebase{
    constructor(account, collection){
        // this.serviceAccount = serviceAccount;
        // this.collection = collection;
        super(account, collection);
        this.lastID = 0;
    }

    // CREATE DOCUMENT
    async createCart(){
        try {
            await this.createDocument({});
            return {echo: 'Cart created successfully.'}
        } 
        
        catch (error){
            return {error: 'Error creating Cart.'};
        }
    }

    async addToCart(idProduct, idCart){
        let productoToAdd;
        let cartToUpdated;
        let flagAux = false;

        // Buscamos el objeto y el carritos necesarios mediante el ID
        try {
            productoToAdd = await ProductosFirebase.readOneProduct(idProduct);
            console.log("PRODUCTOOOO: ", productoToAdd);
            cartToUpdated = await this.readOneDocument(idCart);
            console.log("CARRITOOOO: ", cartToUpdated);
        } catch (error) {
            console.log(error);
        }

        // Comenzamos el proceso de actualización
        let cartAux = cartToUpdated;
        try {
            if(cartToUpdated.listP){
                console.log('DENTROOOOO Bv');
                cartAux.listP.forEach( (element) => {
                    if(element.isbn == productoToAdd.isbn){
                        element.quantity++;
                        flagAux = true;
                    }
                });

                console.log('cartAux: ', cartAux);

                if(flagAux){
                    return await this.updateDocumentByID(idCart, cartAux);
                    // await this.updateDocumentByID({isbn: productInTable[0].isbn}, {stock: totalStock});
                } else {
                    cartToUpdated.listP.push({
                        title: productoToAdd.title,
                        price: productoToAdd.price,
                        isbn: productoToAdd.isbn,
                        thumbnail: productoToAdd.thumbnail,
                        id: productoToAdd.id,
                        quantity: 1
                    })
                    return await this.updateDocumentByID(idCart, cartAux);
                }
            // Se crea la propiedad listP en caso que este no exista
            } else {
                console.log('DENTROOOOO');
                cartAux.listP = [
                    {
                        title: productoToAdd.title,
                        price: productoToAdd.price,
                        isbn: productoToAdd.isbn,
                        thumbnail: productoToAdd.thumbnail,
                        id: productoToAdd.id,
                        quantity: 1
                    }
                ]
                await this.updateDocumentByID(idCart, cartAux);            
            }

        } catch (error) {
            console.log(error);
        }
    }

    // READ ALL CARTS
    async readAllCarts(){
        try {
            // READING ALL PRODUCTS
            let carts = await this.readAllDocuments();
            return carts;
        } 
        
        catch (error){
            return error;
        }
    }

    // READ ONE CART
    async showCart(id){
        try {
            // READING ONE PRODUCT
            let cart = await this.readOneDocument(id);
            if (cart){
                return cart;
            } else {
                return {error: 'Cart not found'};
            }
        } catch (error){
            console.log(error);
        }
    }

    // UPDATE -> Deleting all products from a cart
    async deleteAllFromCart(idCart) {
        let cartToUpdated;
        
        try {
            cartToUpdated = await this.readOneDocument(idCart);
            if(cartToUpdated.listP.length > 0) {
                cartToUpdated.listP = [];
                return await this.updateDocumentByID(idCart, cartToUpdated);
            } else {
                return {error: "El carrito ya esta vacío"};
            }
        } catch (error) {
            return {error: error};
        }
    }

    // UPDATE -> Deleting an item from a cart
    async deleteFromCart(idProduct, idCart){
        let productoToDelete;
        let cartToUpdated;

        // Buscamos el objeto y el carritos necesarios mediante el ID
        try {
            productoToDelete = await ProductosFirebase.readOneProduct(idProduct);
            console.log("PRODUCTOOOO TO DELETEEEEE: ", productoToDelete);
            cartToUpdated = await this.readOneCart(idCart);
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

                return await this.updateDocumentByID(idCart, cartAux);
            } else {
                return {error: 'El carrito no tiene productos.'};;            
            }
        } catch (error) {
            console.log(error);
        }

    }

    // DELETE
    async deleteCart(idCart){
        try {
            let retorno = await this.deleteDocumentByID(idCart);
            console.log('retorno', retorno);
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

// let firebase_cart = new CarritosFirebase(serviceAccount, 'Carritos');

/* CREATE CART */
// firebase_cart.createCart(2).then(res => {
//     console.log(res);
// });

/* READ ONE CART */
// firebase_cart.readOneCart(1).then((res) => {
//     console.log(res);
//     return res;
// });

/* ADDING A PRODUCT */
// firebase_cart.addToCart(1, 3);

/* DELETE ALL PRODUCTS FROM CART */
// firebase_cart.deleteAllFromCart(3).then((res) => {
//     console.log(res);
//     return res;
// });

/* DELETE ONE PRODUCT FROM CART */
// firebase_cart.deleteFromCart(1, 3).then((res) => {
//     console.log(res);
//     return res;
// });

/* DELETE A CART */
// firebase_cart.deleteCart(4);

module.exports = CarritosFirebase;