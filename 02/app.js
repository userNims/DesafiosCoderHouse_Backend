const fs = require('fs');

let cartulina = {
    title: 'cartulina',
    price: 123.45,
};

class Contenedor{
    constructor(directory){
        this.directory = "./" + directory
    }

    save(obj){ 
        fs.readFile(this.directory, 'utf-8',(error, data) => {
            if (data == ""){
                fs.writeFile(this.directory, "["+JSON.stringify(obj)+"]", (error)=>{
                    if (error){
                        console.log('Error en la escritura del archivo');
                    } else {
                        console.log('Escritura exitosa! :D');
                    }
                });
            } else {
                let tempInfo = JSON.parse(data);
                tempInfo.push(obj);
                console.log(JSON.stringify(tempInfo));
                console.log(this.directory);
                fs.writeFile(this.directory, JSON.stringify(tempInfo),(error)=>{
                    if (error){
                        console.log('Error en la escritura del archivo');
                    } else {
                        console.log('Escritura exitosa!');
                    }
                });
            }
        });
    }

    getById(){

    }

    getAll(){

    }

    deleteById(){

    }

    deleteAll(){

    }
}

let productos = new Contenedor('productos.txt');

console.log(productos.directory);
productos.save(cartulina);
// console.log(JSON.stringify(cartulina));


// fs.readFile('./productos.txt', 'utf-8', (error, data)=>{
//     if (data === ""){
//         console.log('vacio');
//     } else {
//         console.log('no vacio');
//         console.log(data);
//     }
// });


