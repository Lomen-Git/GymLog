const { Session, User } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')


const tokenSessionExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
        request.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      
      const session = await Session.findOne({ 
        where: {
            userId: decoded.id,
        },
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'isDisabled']
          }
        ]
      })

      if (!session) {
        return response.status(401).json({ error: 'invalid session, try relogging' })
      }

      if (session.isDisabled || session.user.isDisabled) {
        return response.status(403).json({ error: 'account or session is disabled' })
      }

      // Aseta käyttäjä ja sessio request-objektiin
      request.session = session
      request.user = session.user

      next()

    } catch (error) {
      console.log(error)
      return response.status(401).json({ error: 'error confirming session' })
    }
  } else {
    return response.status(401).json({ error: 'authorization token missing or invalid' })
  }
}

module.exports = tokenSessionExtractor