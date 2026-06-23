// Imports
const { User } = require('./models')

const toPlain = (instance) => (instance ? instance.get({ plain: true }) : null)

// Code
class UserDaoSql {

    get = async () => {
        const rows = await User.findAll()
        return rows.map((row) => row.get({ plain: true }))
    }

    getById = async (id) => {
        const row = await User.findByPk(id)
        return toPlain(row)
    }

    getByEmail = async (email) => {
        const row = await User.findOne({ where: { email } })
        return toPlain(row)
    }

    create = async (newUser) => {
        const created = await User.create(newUser)
        return toPlain(created)
    }

    update = async (identifier, updatedUser) => {
        const isNumericId = !isNaN(identifier)
        const where = isNumericId ? { id: Number(identifier) } : { email: identifier }

        await User.update(updatedUser, { where })
        return isNumericId ? this.getById(identifier) : this.getByEmail(identifier)
    }

    updateLastConection = async (email) => {
        // La tabla legacy `usuarios` no tiene columna `last_connection`.
        // Mantenemos la firma del método para no romper la capa de servicios.
        return this.getByEmail(email)
    }

    delete = async (identifier) => {
        const isNumericId = !isNaN(identifier)
        const where = isNumericId ? { id: Number(identifier) } : { email: identifier }
        const deletedCount = await User.destroy({ where })
        return { deletedCount }
    }

    findUsers = async (connectionLimit) => {
        const rows = await User.findAll({
            order: [['id', 'DESC']],
            limit: Number(connectionLimit),
        })
        return rows.map((row) => row.get({ plain: true }))
    }

    setResetToken = async (email, token, expiry) => {
        await User.update(
            { resetToken: token, resetTokenExpiry: expiry },
            { where: { email } }
        )
    }

    getByResetToken = async (token) => {
        const row = await User.findOne({ where: { resetToken: token } })
        return toPlain(row)
    }

    clearResetToken = async (email) => {
        await User.update(
            { resetToken: null, resetTokenExpiry: null },
            { where: { email } }
        )
    }
}

// Exports
module.exports = UserDaoSql
