//Carregando módulos
    const express = require('express');
    const handlerbars = require('express-handlebars');
    const bodyParser = require("body-parser");
    const app = express()
    //const mongoose = require("mongoose");

//Configurações
    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //Handlebars
        app.engine('handlebars', handlerbars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    //Mongoose
//Rotas


//Outros
const Port = 8081
app.listen(Port, () => {
    console.log("Servidor rodando!!")
})