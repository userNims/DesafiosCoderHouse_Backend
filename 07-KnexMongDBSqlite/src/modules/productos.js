const { options } = require('../options/mariaDB');

class Contenedor {
    constructor(options, tableName) {
        this.opt = options;
        this.tableName = tableName;
    }
    
    knexCall() {
        const knexMysql = require('knex')(this.opt)
        return knexMysql;
    }

    createTable(){
        const creatingTable = (knex) => {            
            knex.schema.createTable(this.tableName, table => {
                table.increments('id').primary();
                table.string('title');
                table.string('autor');
                table.string('thumbnail');
                table.integer('price');
                table.integer('stock');
                table.integer('isbn');
                table.string('description');
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
    insertProduct(object){
        const insertProducts = (knex) => {            
                knex(this.tableName).insert(object)
                .then((result) => {
                    console.log('Producto añadido correctamente');
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
    async getAllProducts(){
        let retorno;

        const getColumns = (knex) => {
            return new Promise((resolve, reject) => {
                knex(this.tableName).select("id", "title", "autor", "thumbnail", "price", "stock", "isbn", "description")
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
    async getProductById(idObject){
        let devolver;
        
        const getProduct = (knex) => {
            return new Promise((resolve, reject) => {
                knex(this.tableName).where({id:idObject}).select("id", "title",  "price", "stock")
                .then( (result) => {
                    console.log('------------------------- INICIO -------------------------------');
                    console.log(`El producto de id ${idObject} es:`);
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

    // UPDATE BY ID
    updateProductById(idObject, objectToUpdate){
        const updateProducts = (knex) => {
            knex(this.tableName).where({id:idObject}).update(objectToUpdate)
            .then((result) => {
                console.log('------------------------- INICIO -------------------------------');
                console.log('El objeto se actualizo correctamente.');
                console.log('Objeto Actualizado: ', objectToUpdate);
                console.log('ID del objeto: ', idObject);
                console.log('--------------------------- FIN ---------------------------------');
            }).catch((err) => {
                console.log('------------------------- INICIO -------------------------------');
                console.log('Se produjo un error al actualizar el objeto.');
                console.log('Error: ', err);
                console.log('--------------------------- FIN ---------------------------------');
            }).finally(() =>{
                knex.destroy();
            });
        }

        updateProducts(this.knexCall());
    }

    // DELETE BY ID
    deleteProductById(number){
        const deleteProducts = (knex) => {
            knex(this.tableName).del().where({id: number})
            .then((result) => {
                if (result == 0){
                    return {Error: `No se encotró el elento con ID${number}`};
                } else{
                    let ready = `Se borró el elemento (${number})`;
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
    deleteAllProducts(){
        const deleteProducts = (knex) => {
            knex(this.tableName).del()
            .then((result) => {
                let ready = `Se borraron todos los elementos (${result})`;
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
            
// ................... Tabla Productos ...................
let productos = new Contenedor(options, 'productosLibros');

// ---------------- Archivos de prueba ----------------
let objetoNuevo = JSON.parse('{ "title": "Física general", "autor": "Martín Casado Márquez","thumbnail": "https://www.marcombocomwp-contentuploads2020109788426728180.jpg", "price": 3320.22, "stock": 12, "isbn": 9781842, "description": "Libro buenisimo que deberias comprar."}');

let objetoNuevo02 = JSON.parse('{"title": "Química. Prueba de acceso a Ciclo Formativos de Grado Superior","autor": "Nerea Pérez - Gorka Arreche", "thumbnail": "https://www.marcombo.com/wp-content/uploads/2017/10/9788426722164.jpg","price": 3326.3,"stock": 12,"isbn": 975142,"description": "Libro buenisimo que deberias comprar."}')

// ................... Creating table ...................
// productos.createTable();

// ---------------- Uso del INSERT ----------------
// productos.insertProduct(objetoNuevo);
// productos.insertProduct(objetoNuevo02);


// ---------------- Uso del GET ----------------
// productos.getAllProducts();


// ---------------- Uso del GET BY ID ----------------
// productos.getProductById(4);


// ---------------- Uso del UPDATE BY ID ----------------
// productos.updateProductById(37, objetoNuevo02)
// productos.getAllProducts();


// ---------------- Uso del DELETE ALL ----------------
// productos.deleteAllProducts();
// productos.getAllProducts();


// ---------------- Uso del DELETE BY ID ----------------
// productos.deleteProductById(40);
// productos.getAllProducts();


// ----------------- Llamadas Asíncronas -----------------
// let showAllProducts = productos.getAll()
//     .then( (result) => {
//         return result;
//     });

// setTimeout(() => {
//     console.log('SHOW ALL: ', showAllProducts);
// }, 1000);