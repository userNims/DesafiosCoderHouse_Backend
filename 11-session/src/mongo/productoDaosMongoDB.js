const Container = require('./ContenedorMongoDB');
const Model = require('./models/productoModel');
const URL = 'mongodb+srv://test:test@cluster0.cy2mb.mongodb.net/school_store?retryWrites=true&w=majority';


class ProductosMongoDB extends Container{
    constructor(model,url){
        super(model,url);
    }

    //& CREATE
    async createProduct(productToAdd){
        try {
            let productoCreated = await this.createDocument(productToAdd).then(res => {
                console.log('productoCreated:');
                console.log(productoCreated);
                return productoCreated;
            });
        } catch (error) {
            return {Error: `Falla al agregar el Producto: ${error}`}
        }
    }

    //& READ BY ID
    async readProduct(id){
        try {
            let readed = await this.read({id: id});
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

    //& READ ALL
    async readAllProducts(){
        try {
            let allProducts = await this.readAllDocuments().then( res => res);
            return allProducts;
        } catch (error) {
            return {Error: `Falla al leer todos los productos: ${error}`}

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
    price: 3326.3,
    thumbnail: "https://www.marcombo.com/wp-content/uploads/2017/10/9788426722164.jpg"
}

let producto_temp03 = {
    title: "Mochila",
    price: 5000,
    thumbnail: "https://cdn-icons-png.flaticon.com/512/546/546667.png"
}

let producto_temp04 = {
    title: "Lapiz",
    price: 300,
    thumbnail: "https://cdn-icons-png.flaticon.com/512/588/588395.png"
}

// productos.connectDBS();

/* SAVE PRODUCT */
// productos.createProduct(producto_temp04);

/* READ ALL PRODUCTS */
// productos.readAllProducts().then( result => {
//     console.log(result);
// });

module.exports = productos;
