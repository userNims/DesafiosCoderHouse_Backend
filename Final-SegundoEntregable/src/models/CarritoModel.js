const mongoose = require('mongoose');

const carritoModel = new mongoose.Schema ({
    ourID: {type: Number, require: true},
    listP: {type: Object}
}, {versionKey: false, timestamps: true});


module.exports = mongoose.model('carritos', carritoModel);