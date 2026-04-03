// Imports
const { MongoSingleton } = require("../utils/singleton");

// Exports
module.exports = {
    connectDB: async () => {
        try {
            await MongoSingleton.getInstance()
        }
        catch (error) {
            console.log(error)
        }
    }
}