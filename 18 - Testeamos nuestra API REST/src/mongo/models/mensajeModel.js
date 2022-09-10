const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema ({
    author: {type: Object, require: true},
    text: {type: String, require: true},
    timestamp: {type: String, require: true}
}, {versionKey: false});

mensajeSchema.set('toObject', {getters: true})
module.exports = mongoose.model('mensajes', mensajeSchema);