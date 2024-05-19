const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para JSON e CORS
app.use(express.json());
app.use(cors());

// Configuração do Mongoose para remover a opção useCreateIndex
mongoose.set('useCreateIndex', true);

// Conexão com o MongoDB usando a variável de ambiente
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro de conexão com o MongoDB:"));
db.once("open", () => {
    console.log("Conectado ao MongoDB!");
});

// Servindo arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importação de rotas
const brownieRoutes = require("./routes/brownie/brownie");
const mousseRoutes = require("./routes/mousse/mousse");
const paoDeMelRoutes = require("./routes/PaoDeMel/paoDeMel");
const todosItensRoutes = require("./routes/todosItens/todosItens");
const custosRoutes = require("./routes/custos/custos");

// Uso de rotas
app.use('/brownie', brownieRoutes);
app.use('/mousse', mousseRoutes);
app.use('/paodemel', paoDeMelRoutes);
app.use('/todositens', todosItensRoutes);
app.use('/custos', custosRoutes);

// Rota padrão para verificar se o servidor está funcionando
app.get('/', (req, res) => {
    res.send('Hello, Heroku!');
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}/`);
});
