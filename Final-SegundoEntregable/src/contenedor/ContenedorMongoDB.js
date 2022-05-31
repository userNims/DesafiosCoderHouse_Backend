const {mongoose} = require('mongoose');
const Model = require('../models/ContainerModel');
// const URL = 'mongodb+srv://test:test@cluster0.cy2mb.mongodb.net/Docebo?retryWrites=true&w=majority';

class ContenedorMongoDB {

    constructor(model,url){
        this.lastID = 0;
        this.model = model;
        this.url = url;
    }
    
    // CHECK ID
    async checkID(){
        try {
            let ID_aux = await this.model.find().sort({ourID: -1}).limit(1);
            console.log('INSIDEEEEEEEEE');
            if(ID_aux.length == 0){
                console.log('ID_aux: ',ID_aux);
                this.lastID = 0;
                return this.lastID;
            } else {
                console.log('ID_aux: ',ID_aux);
                this.lastID = ID_aux[0].ourID;
                return this.lastID;
            }
            
        } catch (error) {
            console.log(error);
        }
    }
    

    // CONNECT TO DBS
    async connectDBS(){
        try {
            await mongoose.connect(this.url,{
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('Conexión de exitosa a la base de datos.');

        } catch(err){
            console.log(err);
        }
    }

    
    // CREATE DOCUMENT
    async createDocument(object){
        this.connectDBS();
        this.checkID().then( async (res) => {
            try {
                // console.log('DENTRO Bv');
                this.lastID = res + 1;
                object.ourID = this.lastID;
                
                const contenedorModel = new this.model(object);
                let created = await contenedorModel.save();
                console.log('Documento creado con éxito');
                console.log(created);
                return created;
            } catch (error) {
                console.log(error);
            }
        })
    }


    // READ ALL DOCUMENTS
    async readAllDocuments(){
        try {
            this.connectDBS();
            console.log('READ ALL DOCUMENTS');
            let document = await this.model.find();
            console.log(document);
            return document;
        } catch (error) {
            console.log(error);
        }
    }

    // READ DOCUMENT BY ID
    async read(condition){
        try {
            this.connectDBS();
            console.log('READ DOCUMENT BY ID');
            let document = await this.model.find(condition);
            // let document = await this.model.find().where(id);
            // console.log(document);
            return document;
        } catch (error) {
            console.log(error);
        }
    }

    // INSERT MANY DOCUMENTS
    async insertManyDocuments(objects){
        try {
            this.connectDBS();
            console.log('INSERT MANY DOCUMENTS');
            let document = await this.model.insertMany(objects);
            console.log('Documentos insertados exitosamente.');
            return document;
        } catch (error) {
            console.log(error);
        }
    }


    // UPDATE DOCUMENT
    async updateOneDocument(object, change){
        try {
            this.connectDBS();
            console.log('UPDATE DOCUMENT');
            await this.model.updateOne(object, change);
            // console.log('Documento actualizado correctamente.');
        } catch (error) {
            console.log(error);
        }
    }


    // DELETE ONE DOCUMENT
    async deleteOneDocument(condicion){
        try {
            this.connectDBS();
            console.log('DELETE DOCUMENT');
            let deleteDocument = await this.model.deleteOne().where(condicion);
            if (deleteDocument.deletedCount == 0) {
                return false;
            } else {
                return true;
            };
        } catch (error) {
            console.log(error);
        }
    }

    // DELETE DOCUMENT
    async deleteAllDocuments(){
        try {
            this.connectDBS();
            console.log('DELETE ALL DOCUMENT');
            let deleteDocument = await this.model.deleteMany();
            console.log(deleteDocument);
        } catch (error) {
            console.log(error);
        }
    }
}



// let contenedorMongo = new ContenedorMongoDB(Model, URL);

// contenedorMongo.connectDBS();

// /* CREATE DOCUMENT */
// contenedorMongo.createDocument({});


// contenedorMongo.readAllDocuments();
//     .then((res) => {
//         let documento = res;
//         console.log('DOCUMENTO: ', documento);
//     });
// console.log('RESULTADOS: ', contenedorMongo.readAllDocuments());

/* CHECK ID */
// contenedorMongo.checkID().then((res) => {
//     console.log('RES: ', res);
// });

/* UPDATE ONE DOCUMENT */
// contenedorMongo.updateOneDocument({ourID: 26}, {ourID: 30});


/* DELETE ONE DOCUMENT */
// contenedorMongo.deleteOneDocument({ourID: {$eq: 31}});


/* DELETE ALL DOCUMENTS */
// contenedorMongo.deleteAllDocuments();


// let document = contenedorMongo.createDocument_02({ourID: 20})
//     .then((result) => {
//         return result;
//     });

//     setTimeout(() => {
//     console.log('SHOW ALL: ', document);
//     }, 2000);


// contenedorMongo.connectDBS();
// let libreria = new Contenedor("libreria");

// let newProducto1 = {
//     title: "lapiz",
//     price: 20,
//     thumbnail: "google.com/img_lapiz"
// }

// let newProducto2 = {
//     title: "cartulina",
//     price: 80,
//     thumbnail: "google.com/img_cartulina"
// }

// let newProducto3 = {
//     title: "paz mundial",
//     price: 80,
//     thumbnail: "google.com/img_cartulina"
// }

// // Uso del método "save"
// libreria.save(newProducto2);

// // Uso del método getById
// libreria.getById(19);

// // Uso del método getAll
// libreria.getAll();

// // Uso del método deleteById
// libreria.deleteById(19);

// // Uso del método deleteAll
// // libreria.deleteAll();

// // Uso del método deleteAll
// console.log(libreria.updateById(1, newProducto3));;

module.exports = ContenedorMongoDB;