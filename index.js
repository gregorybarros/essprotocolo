// Carregando dependences
const mongoose = require("mongoose")
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const index = express()
const admin = require('./routes/admin')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')

//Configuracoes
    // Session / flash
    index.use(session({
        secret: "essprotocolos",
        resave: true,
        saveUninitialized: true
    }))
    index.use(flash())
    
    // Middlewares
    index.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
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
    index.use('/admin', admin)

// Outros
const PORT = 8081
index.listen(PORT, () => {
    console.log('Servidor rodando!')
})