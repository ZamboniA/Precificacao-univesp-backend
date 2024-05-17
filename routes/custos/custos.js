const { Router } = require ("express");
const { Custos } = require("../../models/CustosSchema");
const router = Router();


router.post("/custos", async (req, res) => {
    try {
        const {
            cobertura,
            recheio,
            sacosPlasticos,
            fita,
            etiqueta,
            custoFixo,
            aluguel,
            internet,
            imposto,
            limpeza,
            dataUpdate
        } = req.body;

        const custos = new Custos({
            cobertura,
            recheio,
            sacosPlasticos,
            fita,
            etiqueta,
            custoFixo,
            aluguel,
            internet,
            imposto,
            limpeza,
            dataUpdate
        });

        const savedCustos = await custos.save();

        console.log(savedCustos);
        res.status(201).json(savedCustos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro." });
    }
});


router.get("/custos", async (req, res) => {
    try {
        const custos = await Custos.find(); 

        res.status(200).json(custos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao buscar os custos." });
    }
});

router.delete("/custos/:id", async (req, res) => {
    try {
        const custo = await Custos.findById(req.params.id);

        if (!custo) {
            return res.status(404).json({ message: "Custo não encontrado." });
        }

        await Custos.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: "Custo excluído com sucesso." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao excluir o custo." });
    }
});

router.put("/custos/:id", async (req, res) => {
    try {
        const {
            cobertura,
            recheio,
            sacosPlasticos,
            fita,
            etiqueta,
            custoFixo,
            aluguel,
            internet,
            imposto,
            limpeza,
            dataUpdate
        } = req.body;

        const updatedCustos = await Custos.findByIdAndUpdate(
            req.params.id,
            {
                cobertura,
                recheio,
                sacosPlasticos,
                fita,
                etiqueta,
                custoFixo,
                aluguel,
                internet,
                imposto,
                limpeza,
                dataUpdate
            },
            { new: true } // Retorna o documento atualizado
        );

        if (!updatedCustos) {
            return res.status(404).json({ message: "Custo não encontrado." });
        }

        console.log(updatedCustos);
        res.status(200).json(updatedCustos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao atualizar o custo." });
    }
});


module.exports = router;