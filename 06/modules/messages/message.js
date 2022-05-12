const fs = require('fs');

class Historial {

    constructor(){
        this.JSONcheck();
    }

    static workArchive = __dirname + '/archivoWork.json';

    JSONcheck(){
        try {
            fs.readFileSync(Historial.workArchive,'utf-8');
            console.log(Historial.workArchive,'encontrado');
        } catch (error) {
            fs.writeFileSync(Historial.workArchive,[]);
            console.log(Historial.workArchive,'creado con exito!');
        }
    }

    addMessage(object){
        // Fecha
        const date = new Date();
        const actual = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} - ${date.getHours()}/${date.getMinutes()}/${date.getSeconds()}`;

        let array = JSON.parse(fs.readFileSync(Historial.workArchive, 'utf-8'));
        object = Object.assign(object, { time: actual });
        array.push(object);
        console.log(object);

        try {
            fs.writeFileSync(Historial.workArchive, JSON.stringify(array, null, 2));
            console.log(`${object.title} añadido a ${Historial.workArchive}`);
        } catch(error) {
            console.log('Error: no se pudo guardar el objeto');
        }
    }

    allMessages(){
        let todo, flag;
        try {
            todo = JSON.parse(fs.readFileSync(Historial.workArchive, 'utf-8'));
            flag = true;
        } catch (error) {
            flag = false;
        }
        if (flag === true){
            return todo;
        } else if (flag === false){
            return 'error con al mostrar todos los objetos';
        }
    }

    deleteAll(){
        const arrayVacio = [];
        try {
            fs.writeFileSync(Historial.workArchive, JSON.stringify(arrayVacio));
            console.log('Todos los objetos en',Historial.workArchive,'fueron borrados');
        } catch (error) {
            console.log('Error: no se pudo borrar los datos');
        }
    }
}

let historial = new Historial();

let newProducto1 = {
    title: "lapiz",
    price: 20,
    thumbnail: "google.com/img_lapiz"
}

module.exports = historial;