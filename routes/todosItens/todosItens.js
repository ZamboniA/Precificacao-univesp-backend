const { Router } = require("express");
const router = Router();
const { PaoDeMel } = require("../../models/PaoDeMelSchema");
const { Mousse } = require("../../models/MousseSchema");
const { Brownie } = require("../../models/BrownieSchema");

router.get("/todositens", async (req, res) => {
    try {
        const brownies = await Brownie.find();
        const mousses = await Mousse.find();
        const paesDeMel = await PaoDeMel.find();


        const browniesComImagens = brownies.map(item => ({
            ...item._doc,
            imagemUrl: `${process.env.HOST}/uploads/${item.imagem}`
        }));

        const moussesComImagens = mousses.map(item => ({
            ...item._doc,
            imagemUrl: `${process.env.HOST}/uploads/${item.imagem}`
        }));

        const paesDeMelComImagens = paesDeMel.map(item => ({
            ...item._doc,
            imagemUrl: `${process.env.HOST}/uploads/${item.imagem}`
        }));
        console.log(process.env.HOST);
        const allItems = [...browniesComImagens, ...moussesComImagens, ...paesDeMelComImagens];

        res.status(200).json(allItems);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ocorreu um erro ao buscar os itens." });
    }
});

module.exports = router;
