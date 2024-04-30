const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MousseSchema = new Schema({
    nome: String,
    ingredientes: {
        leiteCondensado: Number,
        cremeDeLeite: Number,
        maracuja: Number,
        gelatina: Number,
    },
    preco: Number,
    imagem: Object,
    dataUpdate: Date
});

const Mousse = mongoose.model('Mousse', MousseSchema);



module.exports = {
    Mousse
};