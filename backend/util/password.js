const bcrypt = require('bcrypt')

const hashPassword = async (password) => {
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)
    return hash
}

const verifyPassword = async (password, storedHash) => {
    return await bcrypt.compare(password, storedHash)
}

module.exports = { hashPassword, verifyPassword }