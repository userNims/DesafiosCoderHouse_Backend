const {mongoose} = require('mongoose');
const Model = require('./models/containerModel');
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
                // console.log(created);
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
            // console.log(document);
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
    async updateOneDocument(id, change){
        try {
            this.connectDBS();
            console.log('UPDATE DOCUMENT');
            await this.model.updateOne(id, change);
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

module.exports = ContenedorMongoDB;