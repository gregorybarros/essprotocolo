// Carregando dependences
const mongoose = require("mongoose")
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const index = express()
const admin = require('./routes/admin')
const usuario = require('./routes/usuario')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
require('./models/Postagem')
const Postagem = mongoose.model('postagens')
require('./models/Postagem')
const Categoria = mongoose.model('categorias')
const passport = require('passport')
require('./config/auth')(passport)
const {eUser} = require('./helpers/eAdmin')


//Configuracoes
    // Session / Passport / flash 
    index.use(session({
        secret: "essprotocolos",
        resave: true,
        saveUninitialized: true
    }))

    index.use(passport.initialize())
    index.use(passport.session())

    index.use(flash())
    
    // Middlewares
    index.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        res.locals.error = req.flash('error')
        res.locals.user = req.user || null
        
    next()
    })        
    //body-parses
        index.use(bodyParser.urlencoded({extended: true}))
        index.use(bodyParser.json())
    // handlebars
        index.engine('handlebars', handlebars({defaultLayout: 'main'}))
        index.set('view engine', 'handlebars')
    
// Conexao banco de dados
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/teste", {
    useNewUrlParser: true,
    useUnifiedTopology: true 
}).then(() => {
    console.log("Cenectado ao MongoDB!")
}).catch((err)=>{
    console.log("Erro ao se conectar com MongoDB!"+ err)
})

//Public botstrap
    index.use(express.static(path.join(__dirname,'public')))

// Rotas
    index.get('/', eUser, (req, res) => {
        const userName = req.user.nome
        if (req.user.eAdmin == 1){
            adm = true
        }else{
            adm = false
        }
        Postagem.find().lean().populate("empresa").sort({data: "desc"}).then((postagens) => {
            res.render('index', {postagens, userName, adm})  
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar postagens!")
            res.redirect("/404")
        })
    })

    index.get('/login', (req, res) => {
        res.render('outras/login')
    })

    index.post("/login", (req, res, next) =>{
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next)
    })

    index.get('/perfiledit', eUser, (req, res) => {
        res.send('Rota de editar perfil')
    })

    index.get("/postagens", eUser, (req, res) => {
        Postagem.find().lean().populate("empresa").sort({data:"desc"}).then((postagens) => {
            res.render("user/userpostagens", {postagens})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as postagens!")
            res.redirect("/")
        })
       
    })

    index.get('/categorias', eUser, (req, res) => {
        if (req.user.eAdmin == 1){
            adm = true
        }else{
            adm = false
        }
        console.log(adm)
        Categoria.find().lean().sort({date:'desc'}).then((categorias) => {
            res.render("user/usercategorias", {categorias, adm})              
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias" + err)
            res.redirect("/admin")
        })
        
    })

    index.get('/categorias/postagens', eUser, (req, res) => {
        res.send('Rota de protocolos da empresa')
    })

    index.get('/ajuda', eUser, (req, res) => {
        res.send('Rota de ajuda')
    }) 

    index.get("/404", (req, res) => {
        res.send("Erro 404!")
    })

    index.use('/admin', admin)
    index.use('/usuario', usuario)

// Outros
const PORT = 8081
index.listen(PORT, () => {
    console.log('Servidor rodando!')
})