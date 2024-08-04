const router = require('express').Router()
const { User } = require('../models/index')
const { hashPassword } = require('../util/password') // Salasanaan liittyviä apufunktioita


router.get('/', async (request, response, next) => {
    try {
        const users = await User.findAll()
        response.json(users)
    } catch (error) {
        next(error)
    }
})

router.post('/', async (request, response, next) => {
    try {
        const { username, password } = request.body
        
        if (!username || !password) {
            return response.status(400).json({ error: 'username & password are required!' })
        }

        const passwordHash = await hashPassword(password)

        const user = await User.create({ username, passwordHash })
        response.json(user)
    } catch (error) {
        next (error)
    }
})

router.get('/:id', async (request, response, next) => {
    try {
        const user = await User.findByPk(request.params.id)
        if (user) {
          response.json(user)
        } else {
          response.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router