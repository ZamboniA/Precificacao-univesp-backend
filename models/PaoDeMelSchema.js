const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaoDeMelSchema = new Schema({
    nome: String,
    tipo: String,
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
    imagem: String,
    dataUpdate: {
        type: Date,
        default: Date.now
    }
});

const PaoDeMel = mongoose.model('PaoDeMel', PaoDeMelSchema);

module.exports = { PaoDeMel };
