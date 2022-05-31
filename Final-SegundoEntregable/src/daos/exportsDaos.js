/* DBTYPE FROM SERVER.JS */
const dbType = require('../../server')

console.log('DBTYPE: ', dbType);

if (dbType == 'mongodb'){
    const productos = require('./productos/ProductosDaosMongoDB');
    const carritos = require('./carritos/CarritosDaosMongoDB');

    module.exports = {productos, carritos};
} else if (dbType == 'firebase') {
    const productos = require('./productos/ProductosDaosFirebase');
    const carritos = require('./carritos/CarritosDaosFirebase');

    module.exports = {productos, carritos};
} else {
    const productos = require('./productos/ProductosDaosArchivo');
    const carritos = require('./carritos/CarritosDaosArchivo');

    module.exports = {productos, carritos};
}

