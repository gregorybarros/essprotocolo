const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcryptjs')


router.get('/registro', (req, res) => {
    res.render('user/registro')
})

router.post('/registro', (req, res) => {
    
    let erros = []


    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto:'Nome invalido'})
    }

    if(!req.body.sobrenome || typeof req.body.sobrenome == undefined || req.body.sobrenome == null) {
        erros.push({texto:'Sobrenome invalido'})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({texto:'E-mail invalido'})
    }

    if(!req.body.cidade || typeof req.body.cidade == undefined || req.body.cidade == null) {
        erros.push({texto:'Cidade invalida'})
    }

    if(!req.body.estado || typeof req.body.estado == undefined || req.body.estado == null) {
        erros.push({texto:'Estado invalido'})       
    }

    if(!req.body.cep || typeof req.body.cep == undefined || req.body.cep == null) {
        erros.push({texto:'CEP invalido'})
    }

    if(!req.body.endereco || typeof req.body.endereco == undefined || req.body.endereco == null) {
        erros.push({texto:'Endereco invalido'})
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({texto:'Senha invalida'})
    }

    if(!req.body.senha2 || typeof req.body.senha2 == undefined || req.body.senha2 == null) {
        erros.push({texto:'Senha invalida'})
    }

    if(!req.body.dataNas || typeof req.body.dataNas == undefined || req.body.dataNas == null) {
        erros.push({texto:'Data de nascimento invalida'})
    }

    if(!req.body.dataAdm || typeof req.body.dataAdm == undefined || req.body.dataAdm == null) {
        erros.push({texto:'Data de admissao invalida'})
    }
    if(req.body.senha != req.body.senha2) {
        erros.push({texto:'Senhas diferentes'})
    }

    if(req.body.senha.length < 4) {
        erros.push({texto:'Senha muito curta'})
    }    

    if(erros.length > 0) {
        console.log(req.body.estado)
        res.render('user/registro', {erros})
             
    }

    else{
        Usuario.findOne({email: req.body.email}).lean().then((usuario) => {
            if(usuario) {
                req.flash("error_msg", "Ja existe um usuario com este e-mail cadastrado")
                res.redirect("/usuario/registro")
            } else {

                const novoUsuario = new Usuario({
                    sexo:req.body.sexo,
                    nome:req.body.nome,
                    sobrenome:req.body.sobrenome,
                    email:req.body.email,
                    cidade:req.body.cidade,
                    estado:req.body.estado,
                    cep:req.body.cep,
                    endereco:req.body.endereco,
                    senha:req.body.senha,
                    senha:req.body.senha,
                    dataNas:req.body.dataNas,
                    dataAdm:req.body.dataAdm,

                })

                bcrypt.genSalt(10, (erro, salt) => {

                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                    if(erro){

                        req.flash("error_msg", "Houve um erro na cryptografia da senha")
                        res.redirect('/')
                    }
                  
                    novoUsuario.senha = hash

                    novoUsuario.save().then(() => {
                        req.flash("success_msg", "Usuario criado com sucesso")
                        res.redirect('/')
                    }).catch((erro) => {
                        req.flash("error_msg", "Houve um erro ao criar usuario")
                        res.redirect("/usuario/registro")
                    })

                })
                })
                 
                
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar usuario121")
            res.redirect("/")
        })

    }
})

router.get('/logout', (req,res) => {
    req.logout()
    req.flash('success_msg', 'Logout com sucesso!')
    res.redirect('/login')
})

module.exports = router