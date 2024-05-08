const { Router } = require ("express");
const { Mousse } = require("../../models/MousseSchema");
const router = Router();
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: path.resolve(__dirname, '../uploads'),
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const extname = path.extname(file.originalname)
        const filename = file.fieldname + '-' + uniqueSuffix + extname
        callback(null, filename)
    }
});

const upload = multer({ storage: storage });


router.post("/mousse", upload.single('imagem'), async (req, res) => {
    try {
        const { nome, preco, ingredientes = {}, dataUpdate } = req.body;
        const mousse = new Mousse ({
            nome,
            ingredientes: {
                leiteCondensado: ingredientes.leiteCondensado,
                cremeDeLeite: ingredientes.cremeDeLeite,
                maracuja: ingredientes.maracuja,
                gelatina: ingredientes.gelatina,
            },
            preco,
            imagem,
            dataUpdate
        });


        const savedMousse = await mousse.save();

        console.log(savedMousse);
        res.status(201).json(savedMousse)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Ocorreu um erro."});
    }
});

router.get("/mousse", async (req, res) => {
    try {
        const mousse = await Mousse.find(); 

        res.status(200).json(mousse);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao buscar os mousses." });
    }
});

router.get("/mousse/:id", async (req, res) => {
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

router.delete("/mousse/:id", async (req, res) => {
    try {
        const mousse = await Mousse.findById(req.params.id);

        if (!mousse) {
            return res.status(404).json({ message: "Mousse não encontrado." });
        }

        await Mousse.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: "Mousse excluído com sucesso." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao excluir o Mousse." });
    }
});

router.put("/mousse/:id", async (req, res) => {
    try {
        const { ingredientes = {}, preco, dataUpdate } = req.body;

        const updatedFields = {
            ingredientes: {
                leiteCondensado: ingredientes.leiteCondensado,
                cremeDeLeite: ingredientes.cremeDeLeite,
                maracuja: ingredientes.maracuja,
                gelatina: ingredientes.gelatina,
            },
            preco,
            imagem,
            dataUpdate
        };

        const updatedMousse = await Mousse.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

        if (!updatedMousse) {
            return res.status(404).json({ message: "Moussie não encontrado." });
        }

        res.status(200).json(updatedMousse);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao atualizar o moussie." });;
    }
});



module.exports = router;