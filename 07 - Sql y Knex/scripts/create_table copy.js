const { knexMysql } = require('../options/mariaDB');
const { knexSqLite } = require('../options/sqlLite3');

const createTable = async knex => {
    await knex.schema.createTable('productos', table => {
        table.increments('id').primary();
        table.string('title');
        table.string('autor');
        table.string('thumbnail');
        table.integer('price');
        table.integer('stock');
        table.integer('isbn');
        table.string('description');
      });
   }

createTable(knexMysql);
createTable(knexSqLite);