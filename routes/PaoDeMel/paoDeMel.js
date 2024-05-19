const { Router } = require("express");
const { PaoDeMel } = require("../../models/PaoDeMelSchema");
const router = Router();
const multer = require("multer");
const path = require("path");

function calcularPrecoProporcional(precos) {
    const quantidadesUtilizadas = {
        mel: 150,                   // em gramas
        manteiga: 50,               // em gramas
        leiteIntegral: 240,         // em ml
        cacau: 20,                  // em gramas
        fermentoQuimico: 30,        // em gramas
        canelaPo: 2,                // em gramas
        cravoPo: 1,                 // em gramas
        acucar: 150,                // em gramas
        farinhaDeTrigo: 240,        // em gramas
        baunilha: 5,                // em mL
        ovos: 2                     // em unidades
    };

    const quantidadesTotais = {
        mel: 1000,                  // quantidade total em gramas
        manteiga: 1000,             // quantidade total em gramas
        leiteIntegral: 1000,        // quantidade total em ml
        cacau: 1000,                // quantidade total em gramas
        fermentoQuimico: 100,       // quantidade total em gramas
        canelaPo: 1000,             // quantidade total em gramas
        cravoPo: 1000,              // quantidade total em gramas
        acucar: 1000,               // quantidade total em gramas
        farinhaDeTrigo: 1000,       // quantidade total em gramas
        baunilha: 1000,             // quantidade total em gramas
        ovos: 12                    // quantidade total em unidades
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

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads'); 
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extname = path.extname(file.originalname);
        const filename = uniqueSuffix + extname;
        callback(null, filename);
    }
});


const upload = multer({ storage: storage });

router.post("/", upload.single("imagem"), async (req, res) => {
    try {
        const { nome, tipo, preco, ingredientes = {}, dataUpdate } = req.body;

        let imagem = null;
        if (req.file) {
            imagem = req.file.filename;
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
            imagem: req.file ? req.file.path : null,
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

router.get("/", async (req, res) => {
    try {
        const paoDeMel = await PaoDeMel.find();
        res.status(200).json(paoDeMel);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao buscar os pães de mel." });
    }
});

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
        res.status(500).json({ message: "Ocorreu um erro ao buscar o pão de mel." });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const paoDeMel = await PaoDeMel.findById(req.params.id);

        if (!paoDeMel) {
            return res.status(404).json({ message: "Pão de mel não encontrado." });
        }

        await PaoDeMel.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: "Pão de mel excluído com sucesso." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao excluir o pão de mel." });
    }
});

router.put("/:id", upload.single('imagem'), async (req, res) => {
    try {
        let imagemUrl = null;
        if (req.file) {
            imagemUrl = req.file.filename;
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
        res.status(500).json({ message: "Ocorreu um erro ao atualizar o pão de mel." });
    }
});

module.exports = router;
