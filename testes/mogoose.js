const mongoose = require("mongoose")
const express = require('express')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagem')
const Postagem = mongoose.model('postagens')

console.log('ola mundo')