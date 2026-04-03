// Imports
const { userModel } = require(`./models/user.model`)

// Code
class UserDaoMongo {
    constructor() {
        this.model = userModel
    }

    get = async () => await this.model.find({})

    getById = async (uid) => await this.model.findOne({ _id: uid })

    getByEmail = async (email) => await this.model.findOne({ email }).lean()

    create = async (newUser) => await this.model.create(newUser)

    update = async (email, updatedUser) => await this.model.updateOne({ email }, updatedUser)

    updateLastConection = async (email) => await this.model.updateOne({ email }, { $currentDate: { "last_connection": { $type: "date" } } })

    delete = async (email) => await this.model.deleteOne({ email })
}

// Exports
module.exports = UserDaoMongo