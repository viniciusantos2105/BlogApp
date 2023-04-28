//Carregando módulos
    const express = require('express');
    const handlebars = require('express-handlebars')
    var handle = handlebars.create({defaultLayout: 'main'});
    const bodyParser = require("body-parser");
    const app = express()
    const admin = require("./routes/admin")
    const path = require("path")
    //const mongoose = require("mongoose");

//Configurações
    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //Handlebars
        app.engine('handlebars', handle.engine);
        app.set('view engine', 'handlebars');
    //Mongoose
    
    //
        //app.use(express.static(path.join(__dirname + "/public")))
//Rotas
    app.get('/', (req, res) => {
        res.send('Rota principal')
    })

    app.get('/posts', (req, res) => {
        res.send("Lista Posts")
    })

    app.use('/admin', admin)
//Outros
const Port = 8081
app.listen(Port, () => {
    console.log("Servidor rodando!!")
})