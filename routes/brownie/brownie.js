const { Router } = require("express");
const { Brownie } = require("../../models/BrownieSchema");
const router = Router();
const multer = require("multer");
const path = require("path");

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
            imagem,
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

router.get("/", async (req, res) => {
    try {
        const brownies = await Brownie.find();
        res.status(200).json(brownies);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao buscar os brownies." });
    }
});

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
        res.status(500).json({ message: "Ocorreu um erro ao buscar o brownie." });
    }
});

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

router.put("/:id", async (req, res) => {
    try {
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
        res.status(500).json({ message: "Ocorreu um erro ao atualizar o brownie." });
    }
});

module.exports = router;
