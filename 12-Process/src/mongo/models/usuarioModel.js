const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema ({
    id: {type: String, require: true},
    password: {type: String, require: true, max: 20},
    name: {type: String, require: true},
    last_name: {type: String, require: true},
    age: {type: Number, require: true},
    alias: {type: String, require: true},
    avatar: {type: String, require: true}
}, {versionKey: false});

// usuarioSchema.set('toObject', {getters: true})
module.exports = mongoose.model('users', usuarioSchema);