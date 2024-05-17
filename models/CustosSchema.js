const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustosSchema = new Schema({
    cobertura: Number,
    recheio: Number,
    sacosPlasticos: Number,
    fita: Number,
    etiqueta: Number,
    custoFixo: Number,
    aluguel: Number,
    internet: Number,
    imposto: Number,
    limpeza: Number,

    dataUpdate: {
        type: Date,
        default: Date.now
    }
});

const Custos = mongoose.model('Custos', CustosSchema);

module.exports = { Custos };
