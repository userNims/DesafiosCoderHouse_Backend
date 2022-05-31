const Container = require('../../contenedor/ContenedorArchivo');
const path = require('path');
const fs = require('fs');

function timeStamp(){
    const date = new Date();
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}
class Productos extends Container{
    constructor(path){
        super(path) // Reemplaza el solo VALOR path
    }


    createProduct(productToAdd) {
        const actual = timeStamp();
        console.log('ACTUAL: ', actual);

        let flag = true;
        let productos = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
        productos.forEach((producto) => {
            if (producto.isbn == productToAdd.isbn) {
                producto.stock += productToAdd.stock;
                flag = false;
                producto.timestamp = actual;
            } 
        });

        if (flag) {
            this.lastID ++;
            productToAdd.id = this.lastID ++;
            productToAdd.timestamp = actual;
            productos.push(productToAdd);
        }

        try {
            fs.writeFileSync(this.path, JSON.stringify(productos, null, 2));
            console.log(`Arhivo correctamente añadido a ${this.path}`);
            return productToAdd.isbn;
        } catch(error) {
            return {error: 'no se pudo guardar el objeto'};
        }
    }

    updateProductByID(id, objectToUpdate){
        const actual = timeStamp();
        let productos = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
        let objectIndex = productos.findIndex(object => object.id == id);
        let tempID;

        if (objectIndex == -1){
            return { error: 'El producto no existe.'}
        } else {
            tempID = productos[objectIndex].id;
            productos[objectIndex] = objectToUpdate;
            productos[objectIndex].timeStamp = actual;
            productos[objectIndex].id = tempID;
        }

        
        fs.writeFileSync(this.path, JSON.stringify(productos, null, 2));
        return productos;
    }
}

let directorioJson = path.join(__dirname, '../../data/productos.json');
let productos = new Productos(directorioJson);
module.exports = {productos, Productos};

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