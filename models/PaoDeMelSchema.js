const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaoDeMelSchema = new Schema({
    nome: String,
    ingredientes: {
        mel: Number,
        manteiga: Number,
        leiteIntegral: Number,
        cacau: Number,
        fermentoQuimico: Number,
        canelaPo: Number,
        cravoPo: Number,
        acucar: Number,
        farinhaDeTrigo: Number,
        sal: Number,
        ovos: Number
    },
    preco: Number,
    // imagem: Object,
    // dataUpdate: Date
});

const PaoDeMel = mongoose.model('PaoDeMel', PaoDeMelSchema);

module.exports = { PaoDeMel };
