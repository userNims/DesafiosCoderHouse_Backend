const { options } = require('../options/sqlLite3');

class Mensajes {
    constructor(options, tableName) {
        this.opt = options;
        this.tableName = tableName;
    }
    
    knexCall() {
        const knexSqLite = require('knex')(this.opt)
        return knexSqLite;
    }

    createTable(){
        const creatingTable = (knex) => {            
            knex.schema.createTable(this.tableName, table => {
                table.increments('id').primary();
                table.string('email');
                table.string('timestamp');
                table.string('message');
            }).then((result) => {
                console.log('Tabla añadida correctamente');
                console.log(result);
            }).catch((err) => {
                console.log('Ocurrio un error');
                console.log(err);
            }).finally(() =>{
                knex.destroy();
            });
    }
    
    creatingTable(this.knexCall());
    }

    // Metodo que guarda los productos
    insertMessage(object){
        const insertProducts = (knex) => {            
                knex(this.tableName).insert(object)
                .then((result) => {
                    console.log('Mensaje añadido correctamente');
                    console.log(result);
                }).catch((err) => {
                    console.log('Ocurrio un error');
                    console.log(err);
                }).finally(() =>{
                    knex.destroy();
                });
        }
        
        insertProducts(this.knexCall());
    }

    // Metodo que muestra la tabla
    async getAllMessages(){
        let retorno;

        const getColumns = (knex) => {
            return new Promise((resolve, reject) => {
                knex(this.tableName).select("id", "email", "timestamp", "message")
                .then((result) => {
                    console.log('------------------------- INICIO -------------------------------');
                    console.log('Tabla:');
                    console.log(result);
                    console.log('--------------------------- FIN ---------------------------------');
                    resolve(result)
                }).catch((err) => {
                    console.log('------------------------- INICIO -------------------------------');
                    console.log('Ocurrio un error:');
                    console.log(err);
                    console.log('--------------------------- FIN ---------------------------------');
                    reject(err);
                }).finally(() =>{
                    knex.destroy();
                });
            })
        }   
        
        retorno = await getColumns(this.knexCall())
            .then( (result) => {
                return result;
            });

        return retorno;
    }

    // Metodo que selecciona por ID
    async getMessageById(idObject){
        let devolver;
        
        const getProduct = (knex) => {
            return new Promise((resolve, reject) => {
                knex(this.tableName).where({id:idObject}).select("id", "email",  "timestamp", "message")
                .then( (result) => {
                    console.log('------------------------- INICIO -------------------------------');
                    console.log(`El mensaje de id ${idObject} es:`);
                    console.log(result);
                    console.log('--------------------------- FIN ---------------------------------');
                    resolve (result);
                }).catch((err) => {
                    console.log('------------------------- INICIO -------------------------------');
                    console.log('Ocurrio un error:');
                    console.log(err);
                    console.log('--------------------------- FIN ---------------------------------');
                    reject (err) ;
                }).finally(() =>{
                    knex.destroy();
                });
            });
        }

        devolver =  await getProduct(this.knexCall())
        .then((result) => {
            return result;
        });

        return devolver;
    }

    // DELETE BY ID
    deleteMessageById(number){
        const deleteProducts = (knex) => {
            knex(this.tableName).del().where({id: number})
            .then((result) => {
                if (result == 0){
                    return {Error: `No se encotró el mensaje con ID${number}`};
                } else{
                    let ready = `Se borró el mensaje (${number})`;
                    console.log(ready);
                    return {Hecho: ready}
                }
            }).catch((err) => {
                console.log(err);
                return {Error: err.message}
            }).finally(() => {
                knex.destroy()
            });
        }
        deleteProducts(this.knexCall());
    }

    // DELETE ALL
    deleteAllMessages(){
        const deleteProducts = (knex) => {
            knex(this.tableName).del()
            .then((result) => {
                let ready = `Se borraron todos los mensajes (${result})`;
                console.log(ready);
                return {Hecho: ready}
            }).catch((err) => {
                console.log(err);
                return {Error: err.message}
            }).finally(() => {
                knex.destroy()
            });
        }
        
        deleteProducts(this.knexCall());
    }
}


// ................... Tabla Mensajeria_01 ...................
let mensajeria_01 = new Mensajes(options, 'mensajes');

// ................... Mensajes de ejemplo ...................
const date = new Date();
const actual = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} - ${date.getHours()}/${date.getMinutes()}/${date.getSeconds()}`

let mensaje_01 = JSON.parse(`{"email": "luluu315@gmail.com", "timestamp": "${actual}", "message": "Me gustan los videojuegos"}`)

let mensaje_02 = JSON.parse(`{"email": "gonzalogramajo@gmail.com", "timestamp": "${actual}", "message": "Sosita es el mejor profe del mundo"}`)

let mensaje_03 = JSON.parse(`{"email": "fernandonavarrp@gmail.com", "timestamp": "${actual}", "message": "Las mudanzas son mi pasión"}`)

let mensaje_04 = JSON.parse(`{"email": "natanmendieta@gmail.com", "timestamp": "${actual}", "message": "Llevo 3 dias sin jugar lefcito y me estoy poniendo de mal humor >:v"}`)


// ................... Creating table ...................
// mensajeria_01.createTable();


// ................... Adding Message ...................
// mensajeria_01.insertMessage(mensaje_01);
mensajeria_01.insertMessage(mensaje_02);
// mensajeria_01.insertMessage(mensaje_03);
// mensajeria_01.insertMessage(mensaje_04);


// ................. Getting All Messages .................
// mensajeria_01.getAllMessages();



// ................. Getting Message By ID .................
// mensajeria_01.getMessageById(3);


// ................. Delete Message By ID .................
// mensajeria_01.deleteMessageById(3);


// ................. Delete All Messages .................
// mensajeria_01.deleteAllMessages();
