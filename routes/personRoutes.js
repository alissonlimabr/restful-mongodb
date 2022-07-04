/* *É aconselhável não manter a regra de negócio no index. Então, criamos essa pasta/arquivo
e o acessamos por meio do Router do express */


// Função do express para dar acesso as rotas
const router = require('express').Router()

// Importo o nosso modelo de entidades para fazer as rotas rest
const Person = require('../models/Person')

/* CREATE - Criação de dados */


// Método post com Async Await para garantir que o tempo da solicitação seja respeitado antes de emitir 
// alguma mensagem para o usuário
router.post('/', async (req,res) => {
    // req.body
    const {name, salary, approved} = req.body
    // {name:Fulano, salary: 3000, approved: false}

        // Caso a solicitação não seja satisfeita, retorna a própria mensagem de erro(return) e para a execução
    if (!name) {
        res.status(422).json({error: 'O nome é obrigatório!'})
        return
    }

    // objeto person recebe os valores da destructuring {name, salary, approved}
    const person = {
        name,
        salary,
        approved
    }

    // create

    try {

        // O mongoose espera receber os parâmetros do objeto Person.
        await Person.create(person)

        // Depois que os dados forem inseridos, exibe o status e a mensagem
        res.status(201).json({message: 'Pessoa inserida com sucesso!'})
    }

    // Se houver algum erro da aplicação, atribui a um erro do servidor(genérico) e envia o erro em json para a aplicação
    // OBS: Não é a melhor forma de implementar o erro, apenas estamos testando o recebimento desse tipo de mensagem
    catch (error) {
        res.status(500).json({error:error})
    }
})


/* READ - Leitura de dados */
router.get('/', async (req,res) => {
    try {

        // Aguarda os dados chegarem para depois enviar como resposta
        const people = await Person.find()
        res.status(200).json(people)
    } catch (error) {
        res.status(500).json({error:error})
    }
})

router.get('/:id', async (req,res) => {
    // Extrair os dados da requisição pela url = req.params

    const id = req.params.id

    try {
        // Método findOne para busca única e, geralmente, passa-se o id ( "_id" no caso do mongodb)
        const person = await Person.findOne({_id: id})

        if (!person) {
            res.status(422).json({ message: 'O usuário não foi encontrado!' })
            return
        }

        // envia como resposta a pessoa
        res.status(200).json(person)
    }
    catch (error) {
        res.status(500).json({error:error})
    }
})


// UPDATE - PUT & PATCH (atualização parcial)

router.patch('/:id', async (req,res) => {
    
    // puxa o id do req.params
    const id = req.params.id

    // Corpo com os dados que serão atualizados
    const {name, salary, approved} = req.body

    const person = {
        name,
        salary,
        approved
    }

    try {

        // Método updateOne do mongoose. Identifica a pessoa pelo id e passa como segundo argumento, o objeto com os dados atualizados
        const updatePerson = await Person.updateOne({_id: id}, person)

        // matchedCount = quantos registros o objeto atualizou. Mesmo passando os mesmos registros, ele atualiza e retorna 1
        // A estratégia consiste em: se o matchedCount for 0, significa que ele não encontrou a pessoa(id). Logo, não é
        // possível atualizar(patch) algo que não existe no BD. Então, retorna que a pessoa/usuário não foi encontrado
        // para os dados fossem atualizados.
        if (updatePerson.matchedCount === 0) {
            res.status(422).json({ message: 'O usuário não foi encontrado!' })
            return
        }

        res.status(200).json(person)
        
    } catch (error) {
        res.status(500).json({error:error})
        
    }

})

// DELETE - Deletar dados

router.delete('/:id', async (req,res) => {
    const id = req.params.id
    // Faz a verificação se o usuário existe, para que possa ser deletado.
    const person = await Person.findOne({_id: id})
    if (!person) {
        res.status(422).json({ message: 'O usuário não foi encontrado!' })
        return
    }

    try {
        // Filtra pelo id a "pessoa" que será removida
        await Person.deleteOne({_id:id})
        res.status(200).json({ message: 'Usuário removido com sucesso!' })

    } catch (error) {
        res.status(500).json({error:error})
        
    }

})

module.exports = router