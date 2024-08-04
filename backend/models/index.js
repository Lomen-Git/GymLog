const User = require('./user')
const Session = require('./session')

// Sessionsuhde
User.hasOne(Session)
Session.belongsTo(User)

module.exports = {
    User, Session
}