const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para JSON e CORS
app.use(express.json());
app.use(cors());

// Configuração do Cloudinary
cloudinary.config({ 
    cloud_name: 'db2bkdlr5', 
    api_key: '456854766172429', 
    api_secret: '4SJxQhJawwzqt19qPfjU3EJo9Qs' 
});

// Configuração do armazenamento do Cloudinary com Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', // A pasta onde as imagens serão armazenadas no Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
});

const upload = multer({ storage: storage });

// Conexão com o MongoDB
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
app.use('/uploads', express.static(path.join(__dirname, 'routes', 'uploads')));

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

// Rota para fazer o upload de arquivos
app.post('/upload', upload.single('file'), (req, res) => {
    // `req.file` contém informações do arquivo enviado para o Cloudinary
    res.json({ fileUrl: req.file.path });
});

// Rota padrão para verificar se o servidor está funcionando
app.get('/', (req, res) => {
    res.send('Hello, Heroku!');
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}/`);
});
