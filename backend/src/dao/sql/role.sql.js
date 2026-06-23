// Imports
const { Role } = require('./models')

const toPlain = (instance) => (instance ? instance.get({ plain: true }) : null)

// Code
class RoleDaoSql {

    get = async () => {
        const rows = await Role.findAll()
        return rows.map((row) => row.get({ plain: true }))
    }

    getById = async (id) => {
        const row = await Role.findByPk(id)
        return toPlain(row)
    }

    getByName = async (name) => {
        const row = await Role.findOne({ where: { nombreRol: name } })
        return toPlain(row)
    }

    create = async (newRole) => {
        const created = await Role.create(newRole)
        return toPlain(created)
    }

    update = async (id, updatedRole) => {
        await Role.update(updatedRole, { where: { id: Number(id) } })
        return this.getById(id)
    }

    delete = async (id) => {
        const deletedCount = await Role.destroy({ where: { id: Number(id) } })
        return { deletedCount }
    }
}

// Exports
module.exports = RoleDaoSql
