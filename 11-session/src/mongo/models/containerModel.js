const mongoose = require('mongoose');

const containerModel = new mongoose.Schema ({
    ourID: {type: Number, require: true}
}, {versionKey: false, timestamps: true});


module.exports = mongoose.model('container', containerModel);