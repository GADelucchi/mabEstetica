// Imports
const { AppointmentStatusHistory } = require('./models')

const toPlain = (instance) => (instance ? instance.get({ plain: true }) : null)

// Code
class AppointmentStatusHistoryDaoSql {

    get = async () => {
        const rows = await AppointmentStatusHistory.findAll({
            order: [['fechaCreacion', 'DESC']],
        })
        return rows.map((row) => row.get({ plain: true }))
    }

    getById = async (id) => {
        const row = await AppointmentStatusHistory.findByPk(id)
        return toPlain(row)
    }

    getByAppointmentId = async (idTurno) => {
        const rows = await AppointmentStatusHistory.findAll({
            where: { idTurno },
            order: [['fechaCreacion', 'DESC']],
        })
        return rows.map((row) => row.get({ plain: true }))
    }

    create = async (newHistory) => {
        const created = await AppointmentStatusHistory.create({
            idTurno: newHistory.idTurno,
            estadoAnterior: newHistory.estadoAnterior || null,
            estadoNuevo: newHistory.estadoNuevo,
            idUsuario: newHistory.idUsuario,
            razon: newHistory.razon || null,
        })
        return toPlain(created)
    }

    delete = async (id) => {
        const deletedCount = await AppointmentStatusHistory.destroy({ where: { id: Number(id) } })
        return { deletedCount }
    }
}

// Exports
module.exports = AppointmentStatusHistoryDaoSql
