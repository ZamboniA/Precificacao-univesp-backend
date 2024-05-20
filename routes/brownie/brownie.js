const { Router } = require("express");
const { Brownie } = require("../../models/BrownieSchema");
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
        chocolateMeioAmargo: 250, // em gramas
        manteiga: 250,            // em gramas
        acucar: 200,              // em gramas
        farinhaDeTrigo: 100,      // em gramas
        sal: 2,                   // em gramas
        ovos: 4                   // unidades
    };

    const quantidadesTotais = {
        chocolateMeioAmargo: 1000, // 1kg
        manteiga: 500,             // 500g
        acucar: 1000,              // 1kg
        farinhaDeTrigo: 1000,      // 1kg
        sal: 500,                  // 500g
        ovos: 12                   // 12 unidades
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

// Rota para adicionar um novo brownie
router.post("/", upload.single('imagem'), async (req, res) => {
    try {
        const { nome, tipo, preco, ingredientes = {}, dataUpdate } = req.body;

        let imagemUrl = null;
        if (req.file) {
            // Se houver uma imagem, obtém a URL do Cloudinary
            imagemUrl = req.file.path;
        }

        const brownie = new Brownie({
            nome,
            tipo,
            ingredientes: {
                chocolateMeioAmargo: ingredientes.chocolateMeioAmargo,
                manteiga: ingredientes.manteiga,
                acucar: ingredientes.acucar,
                farinhaDeTrigo: ingredientes.farinhaDeTrigo,
                sal: ingredientes.sal,
                ovos: ingredientes.ovos
            },
            preco,
            imagem: imagemUrl,
            dataUpdate
        });

        const savedBrownie = await brownie.save();

        console.log(savedBrownie);
        res.status(201).json(savedBrownie);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao salvar o brownie." });
    }
});

// Rota para buscar todos os brownies
router.get("/", async (req, res) => {
    try {
        const brownies = await Brownie.find();
        res.status(200).json(brownies);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao buscar os brownies." });
    }
});

// Rota para buscar um brownie específico pelo ID
router.get("/:id", async (req, res) => {
    try {
        const brownie = await Brownie.findById(req.params.id);

        if (!brownie) {
            return res.status(404).json({ message: "Brownie não encontrado." });
        }

        res.status(200).json(brownie);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao buscar o brownie." });
    }
});

// Rota para calcular o preço proporcional dos ingredientes de um brownie
router.get("/ingredientes/:id", async (req, res) => {
    try {
        const brownie = await Brownie.findById(req.params.id);

        if (!brownie) {
            return res.status(404).json({ message: "Brownie não encontrado." });
        }

        const precosIngredientes = brownie.ingredientes;
        const precosCalculados = calcularPrecoProporcional(precosIngredientes);

        res.status(200).json(precosCalculados);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao calcular os preços dos ingredientes." });
    }
});

// Rota para atualizar um brownie pelo ID
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
                chocolateMeioAmargo: ingredientes.chocolateMeioAmargo,
                manteiga: ingredientes.manteiga,
                acucar: ingredientes.acucar,
                farinhaDeTrigo: ingredientes.farinhaDeTrigo,
                sal: ingredientes.sal,
                ovos: ingredientes.ovos
            },
            preco,
            imagem: imagemUrl,
        };

        const updatedBrownie = await Brownie.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

        if (!updatedBrownie) {
            return res.status(404).json({ message: "Brownie não encontrado." });
        }

        res.status(200).json(updatedBrownie);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao atualizar o brownie." });
    }
});

// Rota para atualizar apenas o preço de um brownie pelo ID
router.put("/preco/:id", async (req, res) => {
    try {
        const preco = req.body.preco;

        const browniePreco = {
            preco
        };

        const updatePreco = await Brownie.findByIdAndUpdate(req.params.id, browniePreco, { new: true });

        if (!updatePreco) {
            return res.status(404).json({ message: "Brownie não encontrado." });
        }

        res.status(200).json(updatePreco);
    } catch (error) {
        res.status(500).json({ message: "Ocorreu um erro ao atualizar o preço do brownie." });
    }
});

// Rota para excluir um brownie pelo ID
router.delete("/:id", async (req, res) => {
    try {
        const brownie = await Brownie.findById(req.params.id);

        if (!brownie) {
            return res.status(404).json({ message: "Brownie não encontrado." });
        }

        await Brownie.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: "Brownie excluído com sucesso." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao excluir o brownie." });
    }
});

module.exports = router;
