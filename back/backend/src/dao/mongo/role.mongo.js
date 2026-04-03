// Imports
const { roleModel } = require('./models/role.model')

// Code
class RoleDaoMongo {
    constructor() {
        this.model = roleModel
    }

    get = async () => await this.model.find({})

    getById = async (rid) => await this.model.findOne({ _id: rid })

    getByName = async (name) => await this.model.findOne({ nombreRol: name }).lean()

    create = async (newRole) => await this.model.create(newRole)

    update = async (email, updatedRole) => await this.model.updateOne({ email }, updatedRole)

    delete = async (email) => await this.model.deleteOne({ email })
}

// Exports
module.exports = RoleDaoMongo