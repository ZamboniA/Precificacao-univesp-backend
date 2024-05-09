const { Router } = require ("express");
const { Brownie } = require("../../models/BrownieSchema");
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


router.post("/brownie", upload.single('imagem'), async (req, res) => {
    try {
        const { nome, tipo, preco, ingredientes = {}, dataUpdate } = req.body;
        const brownie = new Brownie ({
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
            imagem,
            dataUpdate
        });


        const savedBrownie = await brownie.save();

        console.log(savedBrownie);
        res.status(201).json(savedBrownie)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ocorreu um erro."});
    }
});

router.get("/brownie", async (req, res) => {
    try {
        const brownies = await Brownie.find(); 

        res.status(200).json(brownies);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao buscar os brownies." });
    }
});

router.get("/brownie/:id", async (req, res) => {
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

router.delete("/brownie/:id", async (req, res) => {
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

router.put("/brownie/:id", 
// upload.single('imagem'),
async (req, res) => {
    try {
        // let imagemUrl = null;
        // if (req.file) {
        //     imagemUrl = req.file.filename;
        // }

        const { tipo, ingredientes = {}, preco } = req.body;

        const updatedFields = {
            // tipo,
            ingredientes: {
                chocolateMeioAmargo: ingredientes.chocolateMeioAmargo,
                manteiga: ingredientes.manteiga,
                acucar: ingredientes.acucar,
                farinhaDeTrigo: ingredientes.farinhaDeTrigo,
                sal: ingredientes.sal,
                ovos: ingredientes.ovos
            },
            // preco,
            // imagem: imagemUrl,
        };

        const updatedBrownie = await Brownie.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

        console.log(updatedBrownie)
        if (!updatedBrownie) {
            return res.status(404).json({ message: "Brownie não encontrado." });
        }

        res.status(200).json(updatedBrownie);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao atualizar o brownie." });
    }
});



module.exports = router;