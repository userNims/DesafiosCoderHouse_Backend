const Container = require('./ContenedorMongoDB');
const User = require('./usuarioDaosMongoDB');
const Model = require('./models/mensajeModel');
const URL = 'mongodb+srv://test:test@cluster0.cy2mb.mongodb.net/school_store?retryWrites=true&w=majority';

function timestamp(){
    const date = new Date();
    return date.toLocaleDateString() + ' - ' + date.toLocaleTimeString(); 
}

class MensajesMongoDB extends Container{
    constructor(model,url){
        super(model,url);
    }

    //& CREATE
    async createMessage(email, text){
        try {
            let doc = await User.readUser(email);
            let userAux = {author: doc, text: text, timestamp: timestamp()};
            let messageCreated = await this.createDocument(userAux).then(res => {
                // console.log('messageCreated:');
                // console.log(messageCreated);
                return messageCreated;
            });
        } catch (error) {
            return {Error: `Falla al agregar el Producto: ${error}`}
        }
    }

    //& READ ALL
    async readAllMessages(){
        try {
            let allMessages = await this.readAllDocuments().then( res => res);
            let allMessagesClean = []

            //? Sacando _id del objeto
            allMessages.forEach(message => {
                allMessagesClean.push({})
            });

            for (let index = 0; index < allMessages.length; index++) {
                allMessagesClean[index].id = allMessages[0].id;
                allMessagesClean[index].author = {
                    id: allMessages[0].author.id,
                    name: allMessages[0].author.name,
                    last_name: allMessages[0].author.last_name,
                    age: allMessages[0].author.age,
                    alias: allMessages[0].author.alias,
                    avatar: allMessages[0].author.avatar,
                    session: allMessages[0].author.session,
                };
                allMessagesClean[index].text = allMessages[0].text;
                allMessagesClean[index].timestamp = allMessages[0].timestamp;
            }

            return allMessagesClean;
        } catch (error) {
            return {Error: `Falla al leer todos los productos: ${error}`}

        }
    }

    //& DELETE ALL
    async deleteAllMessages(){
        try {
            await this.deleteAllDocuments();
            console.log(`Archivos eliminados con éxito.`);
        } catch (error) {
            console.log(error);
        }
    }

}

let mensaje = new MensajesMongoDB(Model, URL);

let mensaje_temp01 = {
    author: "natanmendieta@gmail.com",
    text: "Libro buenisimo que deberias comprar."
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

//* SAVE MESSAGE
// mensaje.createMessage("natanmendieta@hotmail.com", "Libro buenisimo que deberias comprar.");
// mensaje.createMessage("e_mendieta_martinez@hotmail.com", "Libro buenisimo que deberias comprar.");

//* READ ALL MESSAGES
// mensaje.readAllMessages().then( result => {
//     console.log('AAAAAAA', result);
// });

//* DELETE ALL MESSAGES
// mensaje.deleteAllMessages().then( result => {
//     console.log(result);
// });

module.exports = mensaje;
