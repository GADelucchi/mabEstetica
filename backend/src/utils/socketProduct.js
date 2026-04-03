// Imports
const { logger } = require("../config/logger");

// Code
const socketProduct = async (io) => {
    try {
        io.on(`connection`, socket => {
            // socket.emit(`productos`, products)
        })
    } catch (error) {
        logger.error(error)
    }
}

// Exports
module.exports = { socketProduct }