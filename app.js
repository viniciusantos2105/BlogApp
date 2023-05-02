//Carregando módulos
    const express = require('express');
    const handlebars = require('express-handlebars')
    var handle = handlebars.create({defaultLayout: 'main'});
    const bodyParser = require("body-parser");
    const app = express()
    const admin = require("./routes/admin")
    const path = require("path")
    const mongoose = require("mongoose");

//Configurações
    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //Handlebars
        app.engine('handlebars', handle.engine);
        app.set('view engine', 'handlebars');
    //Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://127.0.0.1:27017/blogapp?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.1", {   
            useNewUrlParser:true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("MongoDB Conectado...")
        }).catch((err) => {
            console.log("Houve um erro ao se conectar ao mongoDB: "+ err)
        })
    // Public
        //app.use(express.static(path.join(__dirname + "/public")))
        app.use((req, res, next) =>{
            console.log("Eu sou um middlewere")
            next()
        })
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