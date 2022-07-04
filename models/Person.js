const { default: mongoose } = require("mongoose");


// Modelo que vai ser repassado para inseção no banco de dados
const Person = mongoose.model('Person', {
    // tipagem das entidades
    name: String,
    salary: Number,
    approved: Boolean
})

module.exports = Person