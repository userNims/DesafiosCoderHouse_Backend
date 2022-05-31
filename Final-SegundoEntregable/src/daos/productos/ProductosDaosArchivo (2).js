const path = require('path');
const Contenedor = require('../../contenedores/ContenedorArchivo.js');

class Productos extends Contenedor {
    constructor(dir){
        super(dir);
    }

// CREAR UN NUEVO PRODUCTO SI ES QUE YA NO EXISTE, SINO ACTUALIZA EL STOCK
    createProduct(productToAdd){
        try {
            if (productToAdd.name 
                && productToAdd.price
                && productToAdd.description
                && productToAdd.thumbnail
                && productToAdd.stock
                && productToAdd.code) {
                    let param = {code: productToAdd.code};
                    let alreadyExist = this.readDocument(param);
                    if (alreadyExist.error) {
                        let created = this.createDocument(productToAdd);
                        return {Hecho: `Producto con ID ${created.id} creado con éxito`};
                    } else {
                        let newStock = productToAdd.stock + alreadyExist.stock;
                        alreadyExist.stock = newStock;
                        let updated = this.updateDocument(alreadyExist.id, alreadyExist);
                        return updated;
                    }
                } else {
                    return {error: `El producto pasado está corrompido`};
            }
        } catch(error) {
            return {error:'falla al crear el producto'};
        }
    }

// LEER UN PRODUCTO SEGUN SU ID
    readProduct(idToFind){
        try {
            let readed = this.readDocument({id: idToFind})
            if (readed.error) {
                return {error:`No se encontró ningún producto con id ${idToFind}`}
            } else {
                return readed;
            }
        } catch (error) {
            return {Error:'Falla al buscar el producto'};
        }
    }

// LEER TODOS LOS PRODUCTOS ALMACENADOS
    readAllProducts(){
        let readed = this.readAll();
        return readed;
    }

// ACTUALIZAR UN PRODUCTO SEGUN SI ID
    updateProduct(id,changes){
        try {
            if (changes.name 
                || changes.price
                || changes.description
                || changes.thumbnail
                || changes.stock
                || changes.code){
                    let productToUpdate = this.readProduct(id)
                    for (let key in changes) {
                        productToUpdate[key] = changes[key];
                    }
                    let updated = this.updateDocument(id,productToUpdate);
                    return updated;
                } else {
                    return {Error: 'No se puede actualizar con los parametros pasados'}
                }
        } catch (error) {
            return {Error: 'Falló la actualización del producto'}
        }
    }

// ELIMINAR UN PRODUCTO SEGUN SU ID
    deleteProduct(id){
        try {
            let deleted = this.deleteDocument(id);
            if (deleted.error) {
                return { error : 'producto no encontrado' };
            } else {
                return { hecho : `El producto con id ${id} fue eliminado` };
            }
        } catch (error) {
            return {error: 'Falló la eliminación del producto'};
        }
    }

// ELIMINAR TODOS LOS PRODUCTOS ALMACENADOS
    deleteAllProducts(){
        try {
            return this.deleteAll();
        } catch (error) {
            return {error: 'Falló la eliminación de todos los productos'}
        }
    }
}

let product = new Productos(path.join(__dirname,"../../data/productos.json"));

let productoAux = {
    name: "Sable laser",
    price:120,
    description:"Tremendo sable laser re fachero, original que lo uso darth vader para exterminar jedis en la orden 66.",
    thumbnail: "https://as.com/meristation/imagenes/2021/05/05/betech/1620209195_059699_1620209343_sumario_grande.jpg",
    stock: 10,
    code: 123456987234
}

let productoCorrompido = {
    price:120,
    description:"Tremendo sable laser re fachero, original que lo uso darth vader para exterminar jedis en la orden 66.",
    thumbnail: "https://as.com/meristation/imagenes/2021/05/05/betech/1620209195_059699_1620209343_sumario_grande.jpg",
    stock: 10,
    code: 123456987234
}

let anotherProduct = {
    name: "Peluche de Grogu",
    price:80,
    description:"La cosa mas tierna que veras en tu vida y de toda la galaxia basicamente.",
    thumbnail: "https://m.media-amazon.com/images/I/81-ustlVcwL._AC_SX569_.jpg",
    stock: 50,
    code: 568734765698
}

// MODULO QUE CREA UN PRODUCTO
//console.log(product.createProduct(productoAux));

// MODULO QUE LEE UN PRODUCTO POR ID
//console.log(product.readProduct(4));

// MODULO QUE LEE TODOS LOS PRODUCTOS
//console.log(product.readAllProducts());

// MODULO QUE ACTUALIZA UN PRODUCTO SEGUN ID Y CAMBIOS
//console.log(product.updateProduct(2,{code: 568734776698}));

// MODULO QUE ELIMINA UN PRODUCTO SEGÚN SU ID
//console.log(product.deleteProduct(2));

// MODULO QUE ELIMINA TODOS LOS PRODUCTOS
//console.log(product.deleteAllProducts());

module.exports = product;