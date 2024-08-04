const jwt = require('jsonwebtoken')
const router = require('express').Router()
const Session = require('../models/session')
const { SECRET } = require('../util/config')
const User = require('../models/user')
const { verifyPassword } = require('../util/password')


router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  if (!user)
    return response.status(401).json({ error: 'invalid username' })

  const passwordCorrect = await verifyPassword(body.password, user.passwordHash)

  if (!passwordCorrect)
    return response.status(401).json({ error: 'invalid password' })

  if (user.isDisabled)
    return response.status(400).json({ error: 'account is disabled' })

  await Session.destroy({
    where: { userId: user.id }
  })

  await Session.create({
    userId: user.id
  })

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    SECRET
  )

  response.status(200).send({ username: user.username, token: token })
})

module.exports = router