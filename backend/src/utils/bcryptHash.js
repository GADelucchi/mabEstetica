// Imports
const bcrypt = require('bcrypt')

// Code
const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12))
}

const isValidPassword = (password, userPassword) => {
    return bcrypt.compareSync(password, userPassword)
}

// Exports
module.exports = {
    createHash,
    isValidPassword
}