const { Router } = require ("express");
const router = Router();
const { PaoDeMel } = require("../../models/PaoDeMelSchema");
const { Mousse } = require("../../models/MousseSchema");
const { Brownie } = require("../../models/BrownieSchema");





router.get("/todos-itens", async (req, res) => {
    try {

        const brownies = await Brownie.find();
        const mousses = await Mousse.find();
        const paesDeMel = await PaoDeMel.find();

        const allItems = [...brownies, ...mousses, ...paesDeMel];

        res.status(200).json(allItems);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao buscar os itens." });
    }
});

module.exports = router;