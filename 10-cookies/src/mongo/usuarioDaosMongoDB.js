const Container = require('./ContenedorMongoDB');
const Model = require('./models/usuarioModel');
const URL = 'mongodb+srv://test:test@cluster0.cy2mb.mongodb.net/school_store?retryWrites=true&w=majority';

class UsuariosMongoDB extends Container{
    constructor(model,url){
        super(model,url);
    }

    //& CREATE
    async createUser(userToAdd){
        try {
            let doc = await this.read({id: userToAdd.email});

            if(doc.length == 0){
                userToAdd.session = false;
                let userCreated = await this.createDocument(userToAdd).then(res => {
                    console.log('userCreated:');
                    console.log(userCreated);
                    return userCreated;
                });
            } else {
                console.log('El email ya fue registrado');
                return {Error: `El usuario ya se agrego: ${error}`}
            }
        } catch (error) {
            return {Error: `Falla al agregar el usuario: ${error}`}
        }
    }

    //& READ BY ID
    async readUser(email){
        try {
            let readed = await this.read({id: email});
            if(readed.length < 1 ){
                return {error: `No existe el email ${email}`};
            } else {
                console.log(readed[0]);
                console.log('Se encontro el usuario con email ', email);
                return readed[0];
            }
        } catch (error) {
            return {error: `Falla al leer el usuario: ${error}`}
        }
    }


    //& UPDATE ONE
    async updateUserSession(email, changes){
        try {
            console.log(email, changes);
            let updatedUser = await this.updateOneDocument({id: email}, changes);
            return {echo: 'Usuario actualizado con éxito'};
        } catch (error) {
            return {error: `Falla al leer todos los productos: ${error}`}
        }
    }


    //& READ ALL
    // async readAllUsers(){
    //     try {
    //         let allProducts = await this.readAllDocuments().then( res => res);
    //         return allProducts;
    //     } catch (error) {
    //         return {Error: `Falla al leer todos los productos: ${error}`}

    //     }
    // }

}

let usuario = new UsuariosMongoDB(Model, URL);

let usuario_temp01 = {
    id: "natanmendieta@gmail.com",
    name: "Natán",
    last_name: "Mendieta",
    age: "26",
    alias: "nims",
    avatar: "https://cdn-icons-png.flaticon.com/512/3468/3468306.png"
}

let usuario_temp02 = {
    id: "e_mendieta_martinez@hotmail.com",
    name: "Eddy",
    last_name: "Mendieta",
    age: "50",
    alias: "Edd",
    avatar: "https://cdn-icons-png.flaticon.com/512/3940/3940403.png"
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

//* SAVE USER
// usuario.createUser(usuario_temp02);

//* READ USER
// usuario.readUser('e_mendieta_martinez@hotmail.com');

module.exports = usuario;
