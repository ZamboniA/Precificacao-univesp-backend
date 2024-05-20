const { Router } = require("express");
const { PaoDeMel } = require("../../models/PaoDeMelSchema");
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
        mel: 150,                   
        manteiga: 50,               
        leiteIntegral: 240,         
        cacau: 20,                  
        fermentoQuimico: 30,        
        canelaPo: 2,                
        cravoPo: 1,                 
        acucar: 150,                
        farinhaDeTrigo: 240,        
        baunilha: 5,                
        ovos: 2                     
    };

    const quantidadesTotais = {
        mel: 1000,                  
        manteiga: 1000,             
        leiteIntegral: 1000,        
        cacau: 1000,                
        fermentoQuimico: 100,       
        canelaPo: 1000,             
        cravoPo: 1000,              
        acucar: 1000,               
        farinhaDeTrigo: 1000,       
        baunilha: 1000,             
        ovos: 12                    
    };

    let resultado = {};
    for (let item in quantidadesUtilizadas) {
        let quantidadeUtilizada = quantidadesUtilizadas[item];
        let precoTotal = precos[item]; 
        let quantidadeTotal = quantidadesTotais[item];

        let precoProporcional = (precoTotal / quantidadeTotal) * quantidadeUtilizada;
        precoProporcional = parseFloat(precoProporcional.toFixed(2));

        resultado[item] = precoProporcional;
    }
    return resultado;
}

// Rota para adicionar um novo pão de mel
router.post("/", upload.single("imagem"), async (req, res) => {
    try {
        const { nome, tipo, preco, ingredientes = {}, dataUpdate } = req.body;

        let imagemUrl = null;
        if (req.file) {
            // Se houver uma imagem, obtém a URL do Cloudinary
            imagemUrl = req.file.path;
        }

        const paodemel = new PaoDeMel({
            nome,
            tipo,
            ingredientes: {
                mel: ingredientes.mel,
                manteiga: ingredientes.manteiga,
                leiteIntegral: ingredientes.leiteIntegral,
                cacau: ingredientes.cacau,
                fermentoQuimico: ingredientes.fermentoQuimico,
                canelaPo: ingredientes.canelaPo,
                cravoPo: ingredientes.cravoPo,
                acucar: ingredientes.acucar,
                farinhaDeTrigo: ingredientes.farinhaDeTrigo,
                baunilha: ingredientes.baunilha,
                ovos: ingredientes.ovos
            },
            preco,
            imagem: imagemUrl,
            dataUpdate
        });

        const savedPaodemel = await paodemel.save();

        console.log(savedPaodemel);
        res.status(201).json(savedPaodemel);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao salvar o pão de mel." });
    }
});

// Rota para buscar todos os pães de mel
router.get("/", async (req, res) => {
    try {
        const paoDeMel = await PaoDeMel.find();
        res.status(200).json(paoDeMel);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao buscar os pães de mel." });
    }
});

// Rota para buscar um pão de mel específico pelo ID
router.get("/:id", async (req, res) => {
    try {
        const paoDeMel = await PaoDeMel.findById(req.params.id);

        if (!paoDeMel) {
            return res.status(404).json({ message: "Pão de mel não encontrado." });
        }

        res.status(200).json(paoDeMel);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao buscar o pão de mel." });
    }
});

// Rota para calcular o preço proporcional dos ingredientes de um pão de mel
router.get("/ingredientes/:id", async (req, res) => {
    try {
        const paoDeMel = await PaoDeMel.findById(req.params.id);

        if (!paoDeMel) {
            return res.status(404).json({ message: "Pão de mel não encontrado." });
        }

        const precosIngredientes = paoDeMel.ingredientes;
        const precosCalculados = calcularPrecoProporcional(precosIngredientes);

        res.status(200).json(precosCalculados);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao calcular os preços dos ingredientes." });
    }
});

// Rota para atualizar um pão de mel pelo ID
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
                mel: ingredientes.mel,
                manteiga: ingredientes.manteiga,
                leiteIntegral: ingredientes.leiteIntegral,
                cacau: ingredientes.cacau,
                fermentoQuimico: ingredientes.fermentoQuimico,
                canelaPo: ingredientes.canelaPo,
                cravoPo: ingredientes.cravoPo,
                acucar: ingredientes.acucar,
                farinhaDeTrigo: ingredientes.farinhaDeTrigo,
                baunilha: ingredientes.baunilha,
                ovos: ingredientes.ovos
            },
            preco,
            imagem: imagemUrl,
        };

        const updatedPaoDeMel = await PaoDeMel.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

        if (!updatedPaoDeMel) {
            return res.status(404).json({ message: "Pão de mel não encontrado." });
        }

        res.status(200).json(updatedPaoDeMel);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao atualizar o pão de mel." });
    }
});

// Rota para atualizar apenas o preço de um pão de mel pelo ID
router.put("/preco/:id", async (req, res) => {
    try {
        const preco = req.body.preco;

        const paoDeMelPreco = {
            preco
        };

        const updatePreco = await PaoDeMel.findByIdAndUpdate(req.params.id, paoDeMelPreco, { new: true });

        if (!updatePreco) {
            return res.status(404).json({ message: "Pão de mel não encontrado." });
        }

        res.status(200).json(updatePreco);
    } catch (error) {
        res.status(500).json({ message: "Ocorreu um erro ao atualizar o preço do pão de mel." });
    }
});

module.exports = router;
