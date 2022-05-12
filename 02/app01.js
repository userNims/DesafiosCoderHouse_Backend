const fs = require('fs'); // Trae el modulo File System

// Objeto de prueba
const almacen = [{
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

class Contenedor{
  constructor(nombreArchivo){
    this.directorio = "./" + nombreArchivo  + ".txt"
  }
  
  save(object){
    let temp_id = almacen.length + 1;
    object.id = temp_id++;
    almacen.push(object);

    fs.writeFileSync(this.directorio, JSON.stringify(almacen, null, 2));

    return object.id;
  }

  getById(number){
    almacen.forEach( item => {
      console.log(item.id);
      if(item.id == number){
        console.log(item);
        return item;
      } else {
        return null;
      }
    });
  }
}

let libreria = new Contenedor('productos');
libreria.save({title: 'Boligoma',price: 1000, thumbnail: 'google.com/imagen_boligoma'});

let aux;
aux = libreria.getById(3);
console.log(aux);