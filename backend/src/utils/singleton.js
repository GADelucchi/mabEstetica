// Imports
const mongoose = require('mongoose')
const { mongoUrl } = require('../../process/config')

// Code
class MongoSingleton {
    static #instance

    constructor() {
        if (MongoSingleton.#instance) {
            throw new Error('⚠️ Ya existe una conexión a la base de datos. Usa MongoSingleton.getInstance()')
        }
        MongoSingleton.#instance = this
    }

    static async getInstance() {
        if (!MongoSingleton.#instance) {
            console.log('🔗 Conectando a la base de datos...')
            try {
                await mongoose.connect(mongoUrl)
                console.log('✅ Conectado a MongoDB')
                new MongoSingleton() // Crea la instancia después de conectar
            } catch (error) {
                console.error('❌ Error al conectar con MongoDB:', error)
                process.exit(1) // Cierra la aplicación en caso de error
            }
        } else {
            console.log('⚡ Base de datos ya conectada')
        }
        return MongoSingleton.#instance
    }
}

// Exports
module.exports = {
    MongoSingleton
}