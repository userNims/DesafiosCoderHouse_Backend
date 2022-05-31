const mongoose = require('mongoose');

const productoModel = new mongoose.Schema ({
    ourID: {type: Number, require: true},
    title: {type: String, require: true},
    autor: {type: String, require: true},
    price: {type: Number, require: true},
    thumbnail: {type: String, require: true},
    editorial: {type: String, require: true},
    pages: {type: Number, require: true},
    edition: {type: Number, require: true},
    publication_date: {type: String, require: true},
    isbn: {type: Number, require: true},
    formato: {type: String, require: true},
    stock: {type: Number, require: true},
}, {versionKey: false, timestamps: true});


module.exports = mongoose.model('productos', productoModel);