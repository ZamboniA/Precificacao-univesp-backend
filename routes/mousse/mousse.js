const { Router } = require("express");
const { Mousse } = require("../../models/MousseSchema");
const router = Router();
const multer = require("multer");
const path = require("path");

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

        resultado[item] = parseFloat(precoProporcional).toFixed(2);
    }
    return resultado;
}

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

router.post("/", upload.single('imagem'), async (req, res) => {
    try {
        const { nome, tipo, preco, ingredientes = {}, dataUpdate } = req.body;

        let imagem = null;
        if (req.file) {
            imagem = req.file.filename;
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
            imagem,
            dataUpdate
        });

        const savedMousse = await mousse.save();

        console.log(savedMousse);
        res.status(201).json(savedMousse)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao salvar o mousse." });
    }
});

router.get("/", async (req, res) => {
    try {
        const mousses = await Mousse.find();
        res.status(200).json(mousses);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao buscar os mousses." });
    }
});

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
        res.status(500).json({ message: "Ocorreu um erro ao buscar o mousse." });
    }
});

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
        res.status(500).json({ message: "Ocorreu um erro ao excluir o Mousse." });
    }
});

router.put("/:id",
 upload.single('imagem'),
 async (req, res) => {
    try {
            let imagemUrl = null;
            if (req.file) {
                imagemUrl = req.file.filename;
            }
        const { tipo, ingredientes = {}, preco } = req.body;

        const updatedFields = {
            tipo,
            ingredientes: {
                leiteCondensado: ingredientes.leiteCondensado || null,
                cremeDeLeite: ingredientes.cremeDeLeite || null,
                maracuja: ingredientes.maracuja || null,
                gelatina: ingredientes.gelatina || null,
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
        res.status(500).json({ message: "Ocorreu um erro ao atualizar o mousse." });
    }
});

module.exports = router;
