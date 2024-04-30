const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BrownieSchema = new Schema({
    nome: String,
    ingredientes: {
        chocolateMeioAmargo: Number,
        manteiga: Number,
        acucar: Number,
        farinhaDeTrigo: Number,
        sal: Number,
        ovos: Number
    },
    preco: Number,
    // imagem: Object,
    // dataUpdate: Date
});

const Brownie = mongoose.model('Brownie', BrownieSchema);

module.exports = { Brownie };
