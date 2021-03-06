const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagem')
const Postagem = mongoose.model('postagens')
const {eAdmin} = require('../helpers/eAdmin')
const {eUser} = require('../helpers/eAdmin')

router.get('/', eAdmin, (req, res) => {
    res.render('admin/index')
})

router.get("/search", eUser, (req, res) => {
let test = req.query.search
erros = []
if (!test || typeof test == undefined || test==null) {
erros.push({texto:'Preencha o campo de pesquisa'})
    res.render('admin/search', {erros})}
    else{

       Postagem.find({titulo:{$regex:`${test}`}}).lean().populate("empresa").sort({data:"desc"}).then((postagens) => {
            res.render("admin/search", {postagens})
            console.log(test.length)
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao realizar pesquisa!")
            
        })
       
    }})   

router.get('/categorias', eAdmin, (req, res) => {

    Categoria.find().lean().sort({date:'desc'}).then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})              
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias" + err)
        res.redirect("/admin")
    })
    
})

router.get('/categorias/add', eAdmin, (req, res) => {
    res.render('admin/addCategorias')
})

router.post('/categorias/nova', eAdmin, (req, res) => {

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

router.get("/categorias/edit/:id", eAdmin, (req, res) => {
    Categoria.findOne({_id: req.params.id}).lean().then((categorias) => {
        res.render('admin/editCategorias', {categorias})
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria nao existe")
        res.redirect("/admin/categorias")
        })  
})

router.post("/categorias/edit", eAdmin, (req, res) => {
    
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

router.post("/categorias/deletar", eAdmin, (req, res) => {
    Categoria.deleteOne({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Empresa deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar empresa!")
        res.redirect("/admin/categorias")
    })
})

router.get("/postagens", eAdmin, (req, res) => {
    Postagem.find().lean().populate("empresa").sort({data:"desc"}).then((postagens) => {
        res.render("admin/postagens", {postagens})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens!")
        res.redirect("/admin")
    })
   
})

router.get("/postagens/add", eUser, (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagens", {categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar formulario!")
    })
    
})

router.post("/postagens/nova", eUser, (req, res) => {
 
    let erros = []

    if(req.body.categoria == 0) {
        erros.push({texto: "Categoria invalida, registre uma categoria"})
    }

    if(erros.length > 0){
        res.render("admin/addpostagem", {erros: erros})
    }else {
        const novaPostagem = {
            titulo: req.body.titulo,
            conteudo: req.body.conteudo,
            empresa: req.body.empresa,            
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Protocolo criado com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro durante o salvamento do protocolo!")
            res.redirect("/admin/postagens")
        })

    }
})

router.get("/postagens/edit/:id", eAdmin, (req, res) => {
   Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {
      Categoria.find().lean().then((empresa) => {
          Categoria.findOne({_id:postagem.empresa}).lean().then((setEmpresa)=>{
            res.render("admin/editpostagens", {empresa, postagem, setEmpresa})
          })            
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar empresas!")
            res.redirect("/admin/postagens")
        })
    }).catch((err)=> {
        req.flash("error_msg", "Houve um erro ao carregar formulario!")
        res.redirect("/admin/postagens")
    })

})

router.post("/postagens/edit", eAdmin, (req, res) => {

    Postagem.findOne({_id: req.body.id}).then((postagem) => {

        postagem.titulo = req.body.titulo
        postagem.conteudo = req.body.conteudo
        postagem.empresa = req.body.empresa

        postagem.save().then(() => {
            req.flash("success_msg", "Protocolo editado com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Erro ao editar protocolo!")
            res.redirect("/admin/postagens")
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao salvar a edicao!")
        res.redirect("/admin/postagens")
    })
})

router.get("/postagens/deletar/:id", eAdmin, (req, res) => {
    Postagem.deleteOne({_id: req.params.id}).then(()=> {
        res.redirect("/admin/postagens")
    })
})

module.exports = router