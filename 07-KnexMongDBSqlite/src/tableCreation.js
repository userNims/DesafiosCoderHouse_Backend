const { knexMysql } = require('./options/mariaDB');
const { knexSqLite } = require('./options/sqlLite3');

const createProductTable = async knex => {
    await knex.schema.createProductTable('contenedor', table => {
        table.increments('id').primary();
        table.string('title');
        table.string('autor');
        table.string('thumbnail');
        table.integer('price');
        table.integer('stock');
        table.integer('isbn');
        table.string('description');
    })
    .then(() => console.log('Table created'))
    .catch(err => {
        console.log(err);
        throw err;
    })
    .finally(() =>{
        knex.destroy();
    });
}


const createMessageTable = async knex => {
    await knex.schema.createMessageTable('mensajes', table => {
        table.increments('id').primary();
        table.string('email');
        // table.string('timestamp');
        table.string('message');
    })
    .then(() => console.log('Table created'))
    .catch(err => {
        console.log(err);
        throw err;
    })
    .finally(() =>{
        knex.destroy();
    });
}

createProductTable(knexMysql);
createMessageTable(knexSqLite);