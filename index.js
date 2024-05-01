require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");


const app = express();
app.use(express.json());


mongoose.connect(process.env.MONGODB_URL);

const brownieRoutes = require("./routes/brownie/brownie");
const mousseRoutes = require("./routes/mousse/mousse");
const paoDeMelRoutes = require("./routes/PaoDeMel/paoDeMel");
app.use(brownieRoutes);
app.use(mousseRoutes);
app.use(paoDeMelRoutes);


app.listen(3001, () =>{
    console.log("Servidor rodando em http://localhost:3001/")
})