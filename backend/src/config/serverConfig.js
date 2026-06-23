// Imports
const { sequelize, Role } = require('../dao/sql/models')
const { enviroment } = require('../../process/config')

const seedRoles = async () => {
    await Role.findOrCreate({ where: { nombreRol: 'admin' }, defaults: { nombreRol: 'admin' } })
    await Role.findOrCreate({ where: { nombreRol: 'profesional' }, defaults: { nombreRol: 'profesional' } })
    await Role.findOrCreate({ where: { nombreRol: 'superadmin' }, defaults: { nombreRol: 'superadmin' } })
    await Role.findOrCreate({ where: { nombreRol: 'paciente' }, defaults: { nombreRol: 'paciente' } })
}

// Exports
module.exports = {
    connectDB: async () => {
        try {
            await sequelize.authenticate()
            // alter:true agrega columnas nuevas sin tocar las existentes
            await sequelize.sync({ alter: enviroment !== 'production' })
            await seedRoles()
            console.log('✅ MySQL conectado con Sequelize')
        } catch (error) {
            console.log('Error al inicializar la base de datos:', error)
        }
    },
}