require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");


const app = express();
app.use(express.json());


mongoose.connect(process.env.MONGODB_URL);

const brownieRoutes = require("./routes/brownie/brownie");
app.use(brownieRoutes);


app.listen(3001, () =>{
    console.log("Servidor rodando em http://localhost:3001/")
})