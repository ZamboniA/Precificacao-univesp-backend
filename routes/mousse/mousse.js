const { Router } = require("express");
const { Mousse } = require("../../models/MousseSchema");
const router = Router();
const multer = require("multer");
const path = require("path");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

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

// Função para calcular o preço proporcional
function calcularPrecoProporcional(precos) {
    const quantidadesUtilizadas = {
        leiteCondensado: 1,    // unidade
        cremeDeLeite: 1,       // unidade
        maracuja: 500,         // em ml
        gelatina: 1            // unidade
    };

    const quantidadesTotais = {
        leiteCondensado: 1,    // unidade
        cremeDeLeite: 1,       // unidade
        maracuja: 1000,        // quantidade total em ml
        gelatina: 1            // unidade
    };

    let resultado = {};
    for (let item in quantidadesUtilizadas) {
        let quantidadeUtilizada = quantidadesUtilizadas[item];
        let precoTotal = precos[item];
        let quantidadeTotal = quantidadesTotais[item];

        let precoProporcional = (precoTotal / quantidadeTotal) * quantidadeUtilizada;

        resultado[item] = parseFloat(precoProporcional.toFixed(2));
    }
    return resultado;
}

// Rota para adicionar um novo mousse
router.post("/", upload.single('imagem'), async (req, res) => {
    try {
        const { nome, tipo, preco, ingredientes = {}, dataUpdate } = req.body;

        let imagemUrl = null;
        if (req.file) {
            // Se houver uma imagem, obtém a URL do Cloudinary
            imagemUrl = req.file.path;
        }

        const mousse = new Mousse({
            nome,
            tipo,
            ingredientes: {
                leiteCondensado: ingredientes.leiteCondensado,
                cremeDeLeite: ingredientes.cremeDeLeite,
                maracuja: ingredientes.maracuja,
                gelatina: ingredientes.gelatina,
            },
            preco,
            imagem: imagemUrl,
            dataUpdate
        });

        const savedMousse = await mousse.save();

        console.log(savedMousse);
        res.status(201).json(savedMousse);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao salvar o mousse." });
    }
});

// Rota para buscar todos os mousses
router.get("/", async (req, res) => {
    try {
        const mousses = await Mousse.find();
        res.status(200).json(mousses);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao buscar os mousses." });
    }
});

// Rota para buscar um mousse específico pelo ID
router.get("/:id", async (req, res) => {
    try {
        const mousse = await Mousse.findById(req.params.id);

        if (!mousse) {
            return res.status(404).json({ message: "Mousse não encontrado." });
        }

        res.status(200).json(mousse);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao buscar o mousse." });
    }
});

// Rota para calcular o preço proporcional dos ingredientes de um mousse
router.get("/ingredientes/:id", async (req, res) => {
    try {
        const mousse = await Mousse.findById(req.params.id);

        if (!mousse) {
            return res.status(404).json({ message: "Mousse não encontrado." });
        }

        const precosIngredientes = mousse.ingredientes;
        const precosCalculados = calcularPrecoProporcional(precosIngredientes);

        res.status(200).json(precosCalculados);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao calcular os preços dos ingredientes." });
    }
});

// Rota para atualizar um mousse pelo ID
router.put("/:id", upload.single('imagem'), async (req, res) => {
    try {
        let imagemUrl = null;
        if (req.file) {
            // Se houver uma imagem, obtém a URL do Cloudinary
            imagemUrl = req.file.path;
        }

        const { tipo, ingredientes = {}, preco } = req.body;

        const updatedFields = {
            tipo,
            ingredientes: {
                leiteCondensado: ingredientes.leiteCondensado,
                cremeDeLeite: ingredientes.cremeDeLeite,
                maracuja: ingredientes.maracuja,
                gelatina: ingredientes.gelatina,
            },
            preco,
            imagem: imagemUrl,
        };

        const updatedMousse = await Mousse.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

        if (!updatedMousse) {
            return res.status(404).json({ message: "Mousse não encontrado." });
        }

        res.status(200).json(updatedMousse);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao atualizar o mousse." });
    }
});

// Rota para atualizar apenas o preço de um mousse pelo ID
router.put("/preco/:id", async (req, res) => {
    try {
        const preco = req.body.preco;

        const moussePreco = {
            preco
        };

        const updatePreco = await Mousse.findByIdAndUpdate(req.params.id, moussePreco, { new: true });

        if (!updatePreco) {
            return res.status(404).json({ message: "Mousse não encontrado." });
        }

        res.status(200).json(updatePreco);
    } catch (error) {
        res.status(500).json({ message: "Ocorreu um erro ao atualizar o preço do mousse." });
    }
});

// Rota para excluir um mousse pelo ID
router.delete("/:id", async (req, res) => {
    try {
        const mousse = await Mousse.findById(req.params.id);

        if (!mousse) {
            return res.status(404).json({ message: "Mousse não encontrado." });
        }

        await Mousse.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: "Mousse excluído com sucesso." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao excluir o mousse." });
    }
});

module.exports = router;
