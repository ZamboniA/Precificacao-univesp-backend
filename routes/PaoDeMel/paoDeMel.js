const { Router } = require ("express");
const { PaoDeMel } = require("../../models/PaoDeMelSchema");
const router = Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: path.resolve(__dirname, '../uploads'),
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const extname = path.extname(file.originalname)
        const filename = uniqueSuffix + extname
        callback(null, filename)
    }
});

const upload = multer({ storage: storage });


router.post("/paodemel", upload.single("imagem"), async (req, res) => {
    try {
        const { nome,tipo, preco, ingredientes = {}, dataUpdate } = req.body;

        let imagem = null;
        if (req.file) { 
            imagem = req.file.filename;
        };

        const paodemel = new PaoDeMel ({
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
                sal: ingredientes.sal,
                ovos: ingredientes.ovos
            },
            preco,
            imagem: req.file ? req.file.path : null,
        });


        const savedPaodemel = await paodemel.save();

        console.log(savedPaodemel);
        res.status(201).json(savedPaodemel)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ocorreu um erro."});
    }
});


router.get("/paodemel", async (req, res) => {
    try {
        const paoDeMel = await PaoDeMel.find(); 

        res.status(200).json(paoDeMel);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao buscar os pães de mel." });
    }
});

router.get("/paodemel/:id", async (req, res) => {
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

router.delete("/paodemel/:id", async (req, res) => {
    try {
        const paoDeMel = await PaoDeMel.findById(req.params.id);

        if (!paoDeMel) {
            return res.status(404).json({ message: "Pão de mel não encontrado." });
        }

        await PaoDeMel.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: "Pão de mel excluído com sucesso." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao excluir o Pão de mel." });
    }
});

router.put("/paodemel/:id", async (req, res) => {
    try {
        // let imagemUrl = null;
        // if (req.file) {
        //     imagemUrl = req.file.filename;
        // }
        const { tipo, ingredientes = {}, preco } = req.body;
        
        const updatedFields = {
            // tipo,
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
                sal: ingredientes.sal,
                ovos: ingredientes.ovos
            },
            // preco,
            // imagem: imagemUrl,
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







module.exports = router;