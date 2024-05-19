const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001

app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro de conexão com o MongoDB:"));
db.once("open", () => {
    console.log("Conectado ao MongoDB!");
});


app.use('/uploads', express.static(path.join(__dirname, 'routes', 'uploads')));


const brownieRoutes = require("./routes/brownie/brownie");
const mousseRoutes = require("./routes/mousse/mousse");
const paoDeMelRoutes = require("./routes/PaoDeMel/paoDeMel");
const todosItensRoutes = require("./routes/todosItens/todosItens");
const custosRoutes = require("./routes/custos/custos");

app.use('/brownie', brownieRoutes);
app.use('/mousse', mousseRoutes);
app.use('/paodemel', paoDeMelRoutes);
app.use('/todositens', todosItensRoutes);
app.use('/custos', custosRoutes);


app.listen(PORT, () => {
 console.log(`Servidor rodando em http://localhost:${PORT}/`);
});
