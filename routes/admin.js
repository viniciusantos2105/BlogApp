const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require('../models/Postagem')
const Postagem = mongoose.model("postagens")

router.get('/', (req, res) =>{
    res.render("admin/index")
})

router.get('/posts', (req, res) =>{
    res.send("Página de posts")
})

router.get('/categorias', (req, res) =>{
    Categoria.find().lean().sort({date: 'desc'}).then((categorias) =>{
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) =>{
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
    
})

router.get('/categorias/add', (req, res) =>{
    res.render("admin/addcategorias")
})

router.post('/categorias/nova', (req, res) =>{

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Nome da categoria é muito pequeno"})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(()=>{
            req.flash("success_msg", "Categoria criada com sucesso!!")
            res.redirect("/admin/categorias")
        }).catch((err) =>{
            req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!")
            res.redirect("/admin")
        })
    }
})

router.get('/categorias/edit/:id', (req, res) => {
    Categoria.findOne({_id:req.params.id}).lean().then((categoria) =>{
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err) =>{
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categorias")
    })
})

router.post('/categorias/edit', (req, res) =>{
    var erros = []
 
    if(req.body.slug.length < 2){
        erros.push({texto: "Slug inválido"})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Nome da categoria é muito pequeno"})
    }

    if(erros.length > 0){
        res.render("admin/editcategorias", {erros: erros})
    }else{
        Categoria.findOne({_id: req.body.id}).then((categoria) =>{
            categoria.nome = req.body.nome
            categoria.slug = req.body.slug

            categoria.save().then(() =>{
                req.flash("success_msg", "Categoria editada com sucesso!!")
                res.redirect("/admin/categorias")
            }).catch((err) =>{
                req.flash("error_msg", "Houve um erro ao salvar edição")
            })
    
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao editar categoria")
            res.redirect("/admin/categorias")
        })
    }

})

router.post("/categorias/deletar", (req, res) =>{
    Categoria.deleteOne({_id: req.body.id}).then(()=>{
        req.flash("success_msg", "Categoria deletada com sucesso!!")
        res.redirect("/admin/categorias")
    }).catch((err) =>{
        req.flash("error_msg", "Houve um erro ao deletar a categoria")
        res.redirect("/admin/categorias")
    })
})

router.get("/postagens", (req, res) =>{
    Postagem.find().populate("categoria").lean().sort({date: 'desc'}).then((postagens) =>{
        res.render("admin/postagens", {postagens: postagens})
    }).catch((err) =>{
        req.flash("error_msg", "Houve um erro ao listar as postagens")
        res.redirect("/admin")
    })
})

router.get("/postagens/add", (req, res) =>{
    Categoria.find().lean().then((categorias) =>{
        res.render("admin/addpostagens", {categorias: categorias})
    }).catch((err) =>{
        req.flash("error_msg", "Houve um erro ao carregar formulário")
        res.redirect("/admin")
    })
})

router.post("/postagens/nova", (req, res) =>{
    var erros = []

    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto: "Titúlo inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }

    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto: "Descrição inválida"})
    }

    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        erros.push({texto: "Conteúdo inválido"})
    }

    if(req.body.titulo.length < 2){
        erros.push({texto: "Titúlo é muito pequeno"})
    }

    if(req.body.conteudo.length < 5){
        erros.push({texto: "Conteúdo é muito pequeno"})
    }

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria inválida, registre uma categoria"})
    }

    if(erros.length > 0){
        res.render("admin/addpostagens", {erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }
        new Postagem(novaPostagem).save().then(()=>{
            req.flash("success_msg", "Postagem criada com sucesso!!")
            res.redirect("/admin/postagens")
        }).catch((err) =>{
            req.flash("error_msg", "Houve um erro ao salvar a postagem, tente novamente!")
            res.redirect("/admin")
        })
    }
})

router.get("/postagens/edit/:id", (req, res) =>{

    Postagem.findOne({_id: req.params.id}).lean().then((postagem) =>{

        Categoria.find().lean().then((categorias) =>{
            res.render("admin/editpostagens", {categorias: categorias, postagem: postagem})
        }).catch((err) =>{
            req.flash("error_msg", "Houve um erro ao listar as categorias")
            res.redirect("/admin/postagens")
        })

    }).catch((err) =>{
        req.flash("error_msg", "Houve um erro ao carregar o formulário de edição")
        res.redirect("/admin/postagens")
    })
})

router.post("/postagens/edit", (req, res) =>{

    Postagem.findOne({_id: req.body.id}).then((postagem) =>{

        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(() =>{
            req.flash("success_msg", "Postagem editada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err) =>{
            req.flash("error_msg", "Erro interno")
            res.redirect("/admin/postagens")
        })
    }).catch((err) =>{
        req.flash("error_msg", "Houve um erro ao salvar a edição")
        res.redirect("/admin/postagens")
    })
})

router.post("/postagens/deletar", (req, res) =>{
    Postagem.deleteOne({_id: req.body.id}).then(()=>{
        req.flash("success_msg", "Postagem deletada com sucesso!!")
        res.redirect("/admin/postagens")
    }).catch((err) =>{
        req.flash("error_msg", "Houve um erro ao deletar a postagem")
        res.redirect("/admin/postagens")
    })
})

module.exports = router