const { Router } = require("express");
const { Custos } = require("../../models/CustosSchema");
const router = Router();

function calcularPrecoProporcional(precos) {
    const quantidadesUtilizadas = {
        cobertura: 500, // em gramas
        recheio: 350, // em gramas
        sacosPlasticos: 1, // unidades
        fita: 1, // unidades
        etiqueta: 1, // unidades
    };

    const quantidadesTotais = {
        cobertura: 1000, // 1kg
        recheio: 400, // 400g
        sacosPlasticos: 50, // 50 unidades
        fita: 300, // 300 unidades
        etiqueta: 100, // 100 unidades
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

router.post("/", async (req, res) => {
    try {
        const {
            cobertura,
            recheio,
            sacosPlasticos,
            fita,
            etiqueta,
            custoFixo,
            aluguel,
            custoVariaveis,
            dataUpdate,
        } = req.body;

        const custos = new Custos({
            cobertura,
            recheio,
            sacosPlasticos,
            fita,
            etiqueta,
            custoFixo,
            aluguel,
            custoVariaveis,
            dataUpdate,
        });

        const savedCustos = await custos.save();

        console.log(savedCustos);
        res.status(201).json(savedCustos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao salvar os custos." });
    }
});

router.get("/", async (req, res) => {
    try {
        const custos = await Custos.find();
        res.status(200).json(custos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao buscar os custos." });
    }
});

router.get("/calculados/:id", async (req, res) => {
    try {
        const custo = await Custos.findById(req.params.id);

        if (!custo) {
            return res.status(404).json({ message: "Custo não encontrado." });
        }

        const precosIngredientes = {
            cobertura: custo.cobertura,
            recheio: custo.recheio,
            sacosPlasticos: custo.sacosPlasticos,
            fita: custo.fita,
            etiqueta: custo.etiqueta,
        };

        const precosCalculados = calcularPrecoProporcional(precosIngredientes);

        const custoCalculado = {
            ...precosCalculados,
            custoFixo: custo.custoFixo,
            custoVariaveis: custo.custoVariaveis,
        };

        res.status(200).json(custoCalculado);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao buscar os custos calculados." });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const custo = await Custos.findById(req.params.id);

        if (!custo) {
            return res.status(404).json({ message: "Custo não encontrado." });
        }

        res.status(200).json(custo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao buscar o custo." });
    }
});

router.delete("/:id", async (req, res) => {
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

router.put("/:id", async (req, res) => {
    try {
        const {
            cobertura,
            recheio,
            sacosPlasticos,
            fita,
            etiqueta,
            custoFixo,
            aluguel,
            custoVariaveis,
            dataUpdate,
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
                custoVariaveis,
                dataUpdate,
            },
            { new: true }
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
