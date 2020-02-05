const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Usuario = new Schema ({
    nome:{
        type:String,
        required: true,
    },
    sobrenome:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    cidade:{
        type:String,
        required:true,
    },
    estado:{
        type:String,
        required:true,
    },
    cep:{
        type:String,
        required:true,
    },
    endereco:{
        type:String,
        required:true,
    },
    senha:{
        type:String,
        required:true,
    },
    dataNas:{
        type:String,
        required:true,
    },
    dataAdm:{
        type:String,
        required:true,
    },
    sexo:{
        type:String,
        required:true,
        
    },
    eAdmin:{
        type:Number,
        default: 0,
    },

})
    
    mongoose.model("usuarios", Usuario)