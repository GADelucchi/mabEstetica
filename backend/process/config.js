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
const jwtPrivateKey = process.env.JWT_PRIVATE_KEY
const enviroment = process.env.ENVIROMENT
const mysqlHost = process.env.MYSQL_HOST
const mysqlPort = process.env.MYSQL_PORT
const mysqlUser = process.env.MYSQL_USER
const mysqlPassword = process.env.MYSQL_PASSWORD
const mysqlDatabase = process.env.MYSQL_DATABASE
const gmailUser = process.env.GMAIL_USER
const gmailPassApp = process.env.GMAIL_PASS_APP

// Exports
module.exports = {
    port,
    jwtPrivateKey,
    enviroment,
    mysqlHost,
    mysqlPort,
    mysqlUser,
    mysqlPassword,
    mysqlDatabase,
    gmailUser,
    gmailPassApp,
}
