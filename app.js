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
    require("./models/Postagem")
    const Postagem = mongoose.model("postagens")
    require("./models/Categoria")
    const Categoria = mongoose.model("categorias")
    const usuarios = require("./routes/usuario")
    const passport = require("passport")
    require("./config/auth")(passport)
//Configurações
    //Sessão
        app.use(session({
            secret: "appblog",
            resave: true,
            saveUninitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    //Middleware
        app.use((req, res, next) =>{
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
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
        Postagem.find().populate("categoria").sort({data: "desc"}).lean().then((postagens) =>{
            res.render("index", {postagens: postagens})
        }).catch((err) =>{
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/404")
        })
    })

    app.get("/postagem/:slug", (req, res) =>{
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem) =>{
            if(postagem){
                res.render("postagem/index", {postagem: postagem})
            }
            else{
                req.flash("error_msg", "Esta postagem não existe")
                res.redirect("/")
            }
        }).catch((err) =>{
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    })

    app.get("/categorias", (req, res)=>{
        Categoria.find().lean().then((categorias) =>{
            res.render("categorias/index", {categorias: categorias})
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro interno ao listar categorias")
            res.redirect("/")
        })
    })

    app.get("/categorias/:slug", (req, res) =>{
        Categoria.findOne({slug: req.params.slug}).lean().then((categoria) =>{
            if(categoria){
                Postagem.find({categoria: categoria._id}).lean().then((postagens) =>{

                    res.render("categorias/postagens", {postagens: postagens, categoria: categoria})

                }).catch((err) =>{
                    req.flash("error_msg", "Houve um erro ao listar os posts")
                    res.redirect("/")
                })
            }
            else{
                req.flash("error_msg", "Esta categoria não existe")
                res.redirect("/")
            }
        }).catch((err) =>{
            req.flash("error_msg", "Houve um erro interno ao carregar a página desta categoria")
            res.redirect("/")
        })
    })

    app.get("/404", (req, res) =>{
        res.send('Erro 404!')
    })

    app.get('/posts', (req, res) => {
        res.send("Lista Posts")
    })

    app.use('/admin', admin)
    app.use('/usuarios', usuarios)
//Outros
const Port = 8081
app.listen(Port, () => {
    console.log("Servidor rodando!!")
})