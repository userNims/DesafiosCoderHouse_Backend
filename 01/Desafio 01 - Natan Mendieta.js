// Consigna 1 - Declarar la clase Usuario
// Consigna 2 - Hacer que el Usuario cuente con los siguientes atributos
class Usuario {
  constructor (nombre = 'No se ingreso nombre', apellido = 'No se ingreso apellid', arrayLibros = [], arrayMascotas = []) {
    // Consigna 2 - Hacer que el Usuario cuente con los siguientes atributos
    this.nombre = nombre;
    this.apellido = apellido;
    this.libros = arrayLibros;
    this.mascotas = arrayMascotas;
  }

// Consigna 3 - Hacer que Usuario cuente con los siguientes métodos
  get getFullName() {
    return `${this.nombre} ${this.apellido}`;
  }

  set addMascota(mascota){
    this.mascotas.push(mascota);
  }

  get countMascota() {
    return this.mascotas.length;
  }

  addBook(nombreLibro, autorLibro){
    this.libros.push({
      nombre: nombreLibro,
      autor: autorLibro,
    })
  }

  get getBookNames() {
    let tempListBooks = [];
    this.libros.forEach(function(book){
      tempListBooks.push(book.nombre);
    });
    return tempListBooks;
  }
}

// Consigna 4 - Crear un objeto llamado usuario con valores arbitrarios e invocar todos sus métodos
const usuario = new Usuario('Nims', 'Smin', [], ['Firulais', 'Michus']);

// Llamada a los métodos del objeto
console.log(usuario.getFullName);
usuario.addMascota = 'Pinocho';
console.log(usuario.countMascota);
usuario.addBook('Mine', 'Tutancamon');
usuario.addBook('Bye', 'Anonimus');
usuario.addBook('Hello', 'You');
console.log(usuario.getBookNames);

console.log(usuario);