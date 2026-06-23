const { Sequelize } = require('sequelize')
const {
    mysqlHost,
    mysqlPort,
    mysqlUser,
    mysqlPassword,
    mysqlDatabase,
} = require('../../process/config')

const sequelize = new Sequelize(mysqlDatabase, mysqlUser, mysqlPassword, {
    host: mysqlHost,
    port: Number(mysqlPort),
    dialect: 'mysql',
    logging: false,
    define: {
        freezeTableName: true,
    },
})

module.exports = { sequelize }
