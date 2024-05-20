const { Router } = require ("express");
const { Custos } = require("../../models/CustosSchema");
const router = Router();

function calcularPrecoProporcional(precos) {
    const quantidadesUtilizadas = {
        cobertura: 500, // em gramas
        recheio: 350,            // em gramas
        sacosPlasticos: 1,              // unidades
        fita: 1,      // unidades
        etiqueta: 1,                   //unidades

    };


    const quantidadesTotais = {
        cobertura: 1000, // 1kg
        recheio: 400,             // 500g
        sacosPlasticos: 50,              // 1kg
        fita: 300,      // 1kg
        etiqueta: 100,                  // 500g
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
            custoVariaveis,
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

router.get("/calculados/:id", async (req, res) => {
    try {
        const custos = await Custos.find();

        const precosIngredientes = {
            cobertura: custos[0].cobertura,
            recheio: custos[0].recheio,
            sacosPlasticos: custos[0].sacosPlasticos,
            fita: custos[0].fita,
            etiqueta: custos[0].etiqueta,
        };

        const precosCalculados = calcularPrecoProporcional(precosIngredientes);

        const custoCalculado = {
            ...precosCalculados,
            custoFixo: custos[0].custoFixo,
            custoVariaveis: custos[0].custoVariaveis
        };

        res.status(200).json(custoCalculado);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao buscar os custos." });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const custos = await Custos.find(); 


        if (!custos) {
            return res.status(404).json({ message: "Custo não encontrado." });
        }
        res.status(200).json(custos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao buscar os custos." });
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
            custoVariaveis,
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
                custoVariaveis,
                dataUpdate
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