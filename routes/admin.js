const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/posts', (req, res) => {
    res.send('Pagina de posts')
})

router.get('/categorias', (req, res) => {
    Categoria.find().lean().sort({date:'desc'}).then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})              
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias" + err)
        res.redirect("/admin")
    })
    
})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addCategorias')
})

router.post('/categorias/nova', (req, res) => {

    let erros = []

    if(!req.body.nome || req.body.nome.length < 2 || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: "Nome invalido"})
    }
    
    if(!req.body.slug || req.body.slug.length < 2 || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({texto: "Slug invalido"})
    }

    if(erros.length > 0) {
        res.render('admin/addCategorias', {erros: erros})
    }
    else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Empresa criada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Erro ao criar empresa!")
            res.redirect("/admin")
        })
    }

})

router.get("/categorias/edit/:id", (req, res) => {
    Categoria.findOne({_id: req.params.id}).lean().then((categorias) => {
        res.render('admin/editCategorias', {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria nao existe")
        res.redirect("/admin/categorias")
        })  
})

router.post("/categorias/edit", (req, res) => {
        Categoria.findOne({_id: req.body.id}).then((categoria) => {

        categoria.nome = req.body.nome
        categoria.slug = req.body.slug
           
        let erros = []

    if(!req.body.nome || req.body.nome.length < 2 || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: "Nome invalido"})
        
    }
    
    if(!req.body.slug || req.body.slug.length < 2 || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({texto: "Slug invalido"})
    }

    if(erros.length > 0) {
        Categoria.findOne({_id: req.body.id}).lean().then((categorias) => {
            
        res.render('admin/editCategorias', {categorias: categorias, erros: erros})

        }
    
         )} else {
        
        categoria.save().then(()=> {
            req.flash("success_msg", "Empresa editada com secesso!")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar empresa editada!")
            res.redirect("/admin/categorias")
        })
    }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar empresa!")
        res.redirect("/admin/categorias")
    
    })
})

module.exports = router