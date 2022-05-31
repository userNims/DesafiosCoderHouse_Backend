const ContenedorFirebase = require('../../contenedor/ContenedorFirebase');
let admin = require("firebase-admin");
let serviceAccount = require("../../data/proyectofinal-docebo-firebase-adminsdk-tpc35-4d3342a41a.json");


class ProductosFirebase extends ContenedorFirebase{
    constructor(account, collection){
        // this.serviceAccount = serviceAccount;
        // this.collection = collection;
        super(account, collection);
        this.lastID = 0;
    }

    // CREATE DOCUMENT
    async createProduct(object){
        try {
            if (object.title 
                && object.autor
                && object.description
                && object.price
                && object.thumbnail
                && object.editorial
                && object.pages
                && object.edition
                && object.publication_date
                && object.isbn
                && object.format
                && object.stock){
                    let document = await this.readAllDocuments();

                    if(document.length == 0) {
                        this.createDocument(object);
                        console.log(`Documento creado con éxito.`);
                    } else {
                        document.forEach( async data => {
                            if (data.isbn == object.isbn) {
                                let stockAux = data.stock + object.stock;
                                let documentUpdate = await this.updateDocumentByID(data.id, {stock: stockAux}).then( results => results);
                                console.log(documentUpdate);
                                console.log(`Documento actualizado con éxito.`);
                            } else {
                                this.createDocument(object);
                                console.log(`Documento creado con éxito.`);
                            }
                        });
                    }

            } else {
                    console.log(`Una o más propiedades son erróneas.`);
                    return {Error: `Una o más propiedades son erróneas.`}
            }
        } 
        
        catch (error){
            console.log(error);
        }
    }

    // READ ALL DOCUMENTS
    async readAllProducts(){
        try {
            // READING ALL PRODUCTS
            let products = await this.readAllDocuments();
            return products;
        } 
        
        catch (error){
            return error;
        }
    }

    // READ ONE DOCUMENT
    async readProduct(id){
        try {
            // READING ONE PRODUCT
            let product = await this.readOneDocument(id);
            return product;
        } catch (error){
            console.log(error);
        }
    }

    // UPDATE BY ID
    async updateProductByID(id, change){
        try {            
            // UPDATING DOCUMENT BY ID
            this.updateDocumentByID(id, change);
        } catch (error){
            console.log(error);
        }
    }

    // DELETE BY ID
    async deleteProductByID(id){
        try {
            // DELETE DOCUMENT BY ID
            let productDeleted = this.deleteDocumentByID(id);
            return productDeleted;
        } catch (error){
            console.log(error);
        }
    }

    // DELETE ALL
    async deleteAllProducts(){
        try {
            // DELETE ALL DOCUMENTS
            this.deleteAllDocuments();
            return {echo: 'Documents deleted successfully'}
        } catch (error){
            return {error: 'Documents not deleted'};
        }
    }
}

let firebase_01 = new ProductosFirebase(serviceAccount, 'Productos');

/* CONNECT TO DATABASE */
// firebase_01.connectDBS();

/* PRODUCT EXAMPLE */
let product_01 = {
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
    format: "17x24 cms",
    stock: 12
}

let product_02 = {
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
    format: "17x24 cms",
    stock: 12
}

/* CREATE DOCUMENT*/
// firebase_01.createProduct(product_02);
// firebase_01.createProduct(product_01);

/* READ ALL DOCUMENTS */
// firebase_01.readAllProducts().then((res) => {
//     console.log(res);
//     return res;
// });

/* READ ONE DOCUMENT */
// firebase_01.readOneProduct(2).then((res) => {
//     console.log(res);
//     return res;
// });

/* UPDATE DOCUMENTS */
// firebase_01.updateProductByID(1, {description: "Excelente libro de física general para consultas rápidas y desarrollo de teoría esencial."});

/* DELETE DOCUMENT BY ID */
// firebase_01.deleteProductByID(1).then((res) => {
//     console.log(res);
// });

/* DELETE ALL DOCUMENTS */
// firebase_01.deleteAllProducts().then( res => {
//     console.log('RES: ', res);
// });

module.exports = firebase_01;