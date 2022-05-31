
let admin = require("firebase-admin");
let serviceAccount = require("../data/proyectofinal-docebo-firebase-adminsdk-tpc35-4d3342a41a.json");


class ContenedorFirebase{
    constructor(account, collection){
        this.serviceAccount = serviceAccount;
        this.collection = collection;
        this.query = this.connectFirebase();
        this.lastID = 0;
    }
    
    async checkID(){
        try {
            let documents = await this.readAllDocuments().then( (res) => {
                return res;
            });
            console.log('DOCUMENTS: ', documents);
            if(documents.length == 0){
                console.log('ID_aux: ', documents);
                this.lastID = 0;
                return this.lastID;
            } else {
                let maxID = Math.max(...documents.map(document => document.id));
                console.log('ID_Max: ',maxID);
                this.lastID = maxID;
                return this.lastID;
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    // CONNECT TO DBS
    // async connectDBS(){
    //     try {
    //         await admin.initializeApp({
    //             credential: admin.credential.cert(this.serviceAccount)
    //         });

    //         let DBS = await admin.firestore();
    //         await DBS.collection(this.collection);
    //         console.log('Conexión de exitosa a la base de datos.');

    //     } catch(err){
    //         console.log(err);
    //     }
    // }

    //CONNECT
connectFirebase(){
        const admin = require('firebase-admin');

        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.cert(this.serviceAccount)
            });
        }

        // admin.initializeApp({
        //     credential: admin.credential.cert(this.serviceAccount)
        // });
        const db = admin.firestore();
        const query = db.collection(this.collection);
        return query;
    }

    // CREATE DOCUMENT
    async createDocument(object){
        try {
            // GETTING THE DOCUMENTS
            const querySnapshot = await this.query.get();
            let docs = querySnapshot.docs;
            const response = docs.map((doc) => ({
                id: doc.id,
                // title: doc.data().title,
                // isbn: doc.data().isbn
            }));
            console.log('response');
            console.log(response);

            // CHOOSING THE CORRECT ID
            // console.log('DOCUMENTS: ', response);
            if(response.length == 0){
                this.lastID = 1;
                console.log('ID_aux: ', this.lastID);
            } else {
                let maxID = Math.max(...response.map(document => parseInt(document.id)));
                this.lastID = maxID + 1;
                console.log('ID_Max: ',this.lastID);
            }
            
            // CREATING THE DOCUMENT
            let id = this.lastID;
            // console.log('ID NEW: ', id);
            // console.log('ID: ', this.lastID);
            let doc = this.query.doc(`${id}`);
            object.id = id;

            await doc.create( object );
            console.log('Documento creado con éxito.');
        } 
        
        catch (error){
            console.log(error);
        }
    }

    // READ ALL DOCUMENTS
    async readAllDocuments(){
        try {
            // READING ALL DOCUMENTS
            const querySnapshot = await this.query.get();
            let docs = querySnapshot.docs;
            const response = docs.map((doc) => ({
                id: doc.data().id,
                isbn: doc.data().isbn,
                title: doc.data().title,
                price: doc.data().price,
                description: doc.data().description,
                stock: doc.data().stock
            }));

            return response;
        } 
        
        catch (error){
            return error;
        }
    }

    // READ ONE DOCUMENT
    async readOneDocument(id){
        try {
            // READING ONE DOCUMENT
            const doc = this.query.doc(`${id}`);
            const document = await doc.get();
            const response = document.data();

            return response;

        } catch (error){
            console.log(error);
        }
    }

    // UPDATE BY ID
    async updateDocumentByID(id, change){
        try {   
            // UPDATING DOCUMENT BY ID
            let doc = this.query.doc(`${id}`);
            const documentUpdated = await doc.update(change);
            console.log('XDDDD', documentUpdated);
            return documentUpdated;
        } catch (error){
            console.log(error);
        }
    }

    // DELETE BY ID
    async deleteDocumentByID(id){
        try {
            // DELETE DOCUMENT BY ID
            let product = await this.readOneDocument(id);

            if (product) {
                let doc = this.query.doc(`${id}`);
                let documenteDeleted = await doc.delete();
                return {echo: 'Document deleted successfully'}
            } else {
                return {error: 'Document not found'};
            }

        } catch (error){
            console.log(error);
        }
    }

    // DELETE ALL
    async deleteAllDocuments(){
        try {
            let deleteState = this.query.get()
            .then(res => {
                res.forEach(element => {
                element.ref.delete();
                });
                return true;
            });
        } catch (error){
            console.log(error);
        }
    }
}

// let firebase_01 = new ContenedorFirebase(serviceAccount, 'Container');

/* CONNECT TO DATABASE */
// firebase_01.connectDBS();


/* CREATE DOCUMENT*/
// firebase_01.createDocument({nombre: 'Coki', apellido: 'Argento'});

/* READ ALL DOCUMENTS */
// firebase_01.readAllDocuments().then((res) => {
//     console.log(res);
//     return res;
// });

/* READ ONE DOCUMENT */
// firebase_01.readOneDocument(2).then((res) => {
//     console.log(res);
//     return res;
// });

/* UPDATE DOCUMENTS */
// firebase_01.updateDocumentByID(3, {nombre: 'Pepito'});

/* DELETE DOCUMENT BY ID */
// firebase_01.deleteDocumentByID(3);

/* DELETE ALL DOCUMENTS */
// firebase_01.deleteAllDocuments().then( res => {
//     console.log('RES: ', res);
// });

module.exports = ContenedorFirebase;