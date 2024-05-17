require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const path = require('path');
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL);

app.use('/uploads', express.static(path.join(__dirname, '/routes/uploads')));

const brownieRoutes = require("./routes/brownie/brownie");
const mousseRoutes = require("./routes/mousse/mousse");
const paoDeMelRoutes = require("./routes/PaoDeMel/paoDeMel");
const todosItens = require("./routes/todosItens/todosItens");
const custos = require("./routes/custos/custos");


app.use(cors());


app.use(brownieRoutes); 
app.use(mousseRoutes);
app.use(paoDeMelRoutes);
app.use(todosItens);
app.use(custos);

app.listen(3001, () =>{
    console.log("Servidor rodando em http://localhost:3001/")
})
