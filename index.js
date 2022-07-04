// Configuração Inicial
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')



// Forma de ler Json/ Middlewares
app.use(
    express.urlencoded({
        extended:true
    }),
)
app.use(express.json())

// Rota inicial
app.get ('/', (req,res) => {
    // A resposta para '/' é um arquivo Json
    res.json({message: 'Oi express!'})
})


// Importação das rotas da API

const personRoutes = require('./routes/personRoutes')

    // O que vier dessa página ('/person') será redirecionado para personRoutes
app.use('/person', personRoutes)

// Passa o usuário e a senha do Banco de Dados por meio de um arquivo dotenv
const DB_USER = process.env.DB_USER
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)

// Entregar uma porta
mongoose
    // bancodaapi é o bd da aplicação, caso não exista, ele cria
    .connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@apicluster.zxd2rn6.mongodb.net/bancodaapi?retryWrites=true&w=majority`)
    // Se a conexão for bem sucessida, ele executa na porta 3000
    .then(() => {
        console.log('Conectado ao MongoDB!')
        app.listen(3000)
    })
    // Se falhar, ele exibe a mensagem de erro no console
    .catch((err) => console.log(err))
