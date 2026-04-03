// Imports
const dotenv = require('dotenv')
const { commander } = require('./commander')
const { mode } = commander.opts()

// Code
// Load environment variables based on the mode
dotenv.config({
    path: mode === 'development' ? './.env.dev' : './.env.prod'
})


const port = process.env.PORT
const mongoUrl = process.env.MONGO_URL
const jwtPrivateKey = process.env.JWT_PRIVATE_KEY
const persistence = process.env.PERSISTENCE
const enviroment = process.env.ENVIROMENT

// Exports
module.exports = {
    port,
    mongoUrl,
    jwtPrivateKey,
    persistence,
    enviroment
}
