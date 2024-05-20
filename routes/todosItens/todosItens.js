const { Router } = require("express");
const router = Router();
const { PaoDeMel } = require("../../models/PaoDeMelSchema");
const { Mousse } = require("../../models/MousseSchema");
const { Brownie } = require("../../models/BrownieSchema");

router.get("/", async (req, res) => {
    try {
        const [brownies, mousses, paesDeMel] = await Promise.all([
            Brownie.find(),
            Mousse.find(),
            PaoDeMel.find()
        ]);

        const browniesComImagens = brownies.map(item => ({
            ...item._doc,
            imagemUrl: item.imagem ? `${process.env.HOST}/uploads/${item.imagem}` : null
        }));

        const moussesComImagens = mousses.map(item => ({
            ...item._doc,
            imagemUrl: item.imagem ? `${process.env.HOST}/uploads/${item.imagem}` : null
        }));

        const paesDeMelComImagens = paesDeMel.map(item => ({
            ...item._doc,
            imagemUrl: item.imagem ? `${process.env.HOST}/uploads/${item.imagem}` : null
        }));

        const allItems = [...browniesComImagens, ...moussesComImagens, ...paesDeMelComImagens];

        res.status(200).json(allItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocorreu um erro ao buscar os itens." });
    }
});

module.exports = router;
