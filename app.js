//Carregando módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    var handle = handlebars.create({defaultLayout: 'main'})
    const bodyParser = require("body-parser")
    const app = express()
    const admin = require("./routes/admin")
    const path = require("path")
    const mongoose = require("mongoose")
    const session = require("express-session")
    const flash = require("connect-flash")
//Configurações
    //Sessão
        app.use(session({
            secret: "appblog",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
    //Middleware
        app.use((req, res, next) =>{
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })    
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
        //app.use(express.static(path.join(__dirname + "/public"))
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