const Container = require('../../contenedor/ContenedorMongoDB');
const Model = require('../../models/ProductsModels');
const URL = 'mongodb+srv://test:test@cluster0.cy2mb.mongodb.net/Docebo?retryWrites=true&w=majority';


class ProductosMongoDB extends Container{
    constructor(model,url){
        super(model,url);
        // super(model, url);
    }

    // CREATE
    async createProduct(productToAdd){
        try {
            let doc = await this.read({code: productToAdd.isbn});
            if (doc.length == 0) {
                let productoCreated = await this.createDocument(productToAdd).then(res => {
                    console.log('productoCreated');
                    console.log(productoCreated);
                    return productoCreated;
                });
            } else {
                let id = doc[0].ourId;
                productToAdd.stock = doc[0].stock + productToAdd.stock;
                return await this.updateOneDocument(id,productToAdd);
            }
        } catch (error) {
            return {Error: `Falla al agregar el Producto: ${error}`}
        }
    }

    // READ BY ID
    async readProduct(id){
        try {
            let readed = await this.read({ourId: id});
            if(readed.length < 1 ){
                console.log('No se encontro el producto con ID.');
            } else {
                console.log(readed);
                console.log('Se encontro el producto con ID.');
                return readed;
            }
        } catch (error) {
            return {Error: `Falla al leer el Producto: ${error}`}
        }
    }

    // READ ALL
    async readAllProducts(){
        try {
            let allProducts = await this.readAllDocuments().then( res => res);
            return allProducts;
        } catch (error) {
            return {Error: `Falla al leer todos los productos: ${error}`}

        }
    }

    // UPDATE
    async updateProductByID(object, change){
        try {
            await this.updateOneDocument(object, change);
            return {Success: `Archivo actualiza con éxito`}
        } catch (error) {
            return {Error: `Falla al actualizar el producto.`};
        }
    }

    // DELETE ONE
    async deleteProductByID(id){
        try {
            await this.deleteOneDocument(id);
            console.log(`Archivo eliminado con éxito.`);
        } catch (error) {
            console.log(error);
        }
    }

    // DELETE ALL
    async deleteAllProducts(){
        try {
            await this.deleteAllDocuments();
            console.log(`Archivos eliminados con éxito.`);
        } catch (error) {
            console.log(error);
        }
    }
}

let productos = new ProductosMongoDB(Model, URL);

let producto_temp01 = {
    title: "Física general",
    autor: "Martín Casado Márquez",
    description: "Libro buenisimo que deberias comprar.",
    price: 3320.22,
    thumbnail: "https://www.marcombo.com/wp-content/uploads/2020/10/9788426728180.jpg",
    editorial: "Marcombo",
    pages: 496,
    edition: 1,
    publication_date: "30/10/2020",
    isbn: 9788426728180,
    formato: "17x24 cms",
    stock: 12,
}

let producto_temp02 = {
    title: "Química. Prueba de acceso a Ciclo Formativos de Grado Superior",
    autor: "Nerea Pérez - Gorka Arreche",
    description: "Libro buenisimo que deberias comprar.",
    price: 3326.3,
    thumbnail: "https://www.marcombo.com/wp-content/uploads/2017/10/9788426722164.jpg",
    editorial: "Marcombo",
    pages: 172,
    edition: 1,
    publication_date: "15/05/2015",
    isbn: 9788426722164,
    formato: "17x24 cms",
    stock: 12
}

// productos.connectDBS(2);

/* SAVE PRODUCT */
// productos.saveProduct(producto_temp02);
// productos.read({ourID: {$eq: 111}}).then(function (result) {
//     console.log(result);
// })

/* READ PRODUCT */
// productos.readProductMongo(1);

/* READ ALL PRODUCTS */
// productos.readAllProducts().then( result => {
//     console.log(result);
// });

/* UPDATE ONE PRODUCT */
// productos.updateProduct({ourID: 1}, {price: 30});

/* DELETE ONE PRODUCT */
// productos.deleteOneProduct({ourID: {$eq: 2}});

/* DELETE ALL PRODUCTS */
// productos.deleteAllProducts();

module.exports = productos;

//----------------------------------------------------------------

// let temp = new Productos('../data/productos.json');
// let productoTemp = {
//     title: "Librazo",
//     autor: "Nerea Pérez - Gorka Arreche",
//     description: "Libro buenisimo que deberias comprar.",
//     price: 3326.3,
//     thumbnail: "https://www.marcombo.com/wp-content/uploads/2017/10/9788426722164.jpg",
//     editorial: "Marcombo",
//     pages: 172,
//     edition: 33,
//     publication_date: "15/05/2015",
//     isbn: 33333333333,
//     formato: "17x24 cms",
//     stock: 3333333333
// };

// // console.log(productos.saveProduct(productoTemp));
// console.log(productos.updateProductById(2, productoTemp));