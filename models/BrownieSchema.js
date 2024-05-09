const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BrownieSchema = new Schema({
    nome: String,
    tipo: String,
    ingredientes: {
        chocolateMeioAmargo: Number,
        manteiga: Number,
        acucar: Number,
        farinhaDeTrigo: Number,
        sal: Number,
        ovos: Number
    },
    preco: Number,
    imagem: String,
    dataUpdate: {
        type: Date,
        default: Date.now
    }
});

const Brownie = mongoose.model('Brownie', BrownieSchema);

module.exports = { Brownie };
