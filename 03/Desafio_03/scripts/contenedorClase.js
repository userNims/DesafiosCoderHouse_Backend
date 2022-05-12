// ----------------- DESAFIO 02 -----------------
const fs = require('fs'); // Trae el modulo File System

// Array de objetos para el almacenaje inicial 
let almacen = [{
  title: 'Cartulina',
  price: 781,
  thumbnail: 'google.com/imagen_cartulina',
  id: 1
},{
  title: 'Tijera',
  price: 654,
  thumbnail: 'google.com/imagen_tijera',
  id: 2
}];

// variable que contiene el ultimo id de almacen 
let id_historial = almacen.length;

// Declaracion de la clase Contenedor
class Contenedor{
  constructor(nombreArchivo){
    this.directorio = "./" + nombreArchivo  + ".txt"
  }
  
  save(object){
    try {
      object.id = id_historial + 1;
      almacen.push(object);
      fs.writeFileSync(this.directorio, JSON.stringify(almacen, null, 2));
    } catch(error) {
      console.log('Errores hubo :(');
    }

    return object.id;
  }

  getById(number){
    let object_temp;
    
    almacen.forEach( item => {
      if(item.id == number){
        object_temp = item;
      }
    });

    if(object_temp === undefined){
      return null;
    } else {
      return object_temp;
    }
  }

  getAll(){
    return almacen;
  }

  deleteById(number){
    let indexObject = almacen.findIndex(object =>
      object.id === number
    );

    if (indexObject === -1){
      console.log('El indice no existe');
    } else {
      almacen.splice(indexObject, 1);
      fs.writeFileSync(this.directorio, JSON.stringify(almacen, null, 2));
    }
  }

  deleteAll(){
    try {
      almacen = [];
      fs.writeFileSync(this.directorio, JSON.stringify(almacen));
      console.log('Borrado Exitoso');
    } catch(error){
      console.log('Errores Hubo');
    }
    
  }
}

let libreria = new Contenedor('productos');

libreria.save({title: 'Boligoma',price: 1000, thumbnail: 'google.com/imagen_boligoma'});

// console.log(libreria.getById(3));
// console.log("------------------------------------");

// console.log(libreria.getAll());
// console.log("------------------------------------");

// libreria.deleteById(2);
// console.log(almacen);

/* libreria.deleteAll();
console.log("------------------------------------"); */

module.exports = libreria;