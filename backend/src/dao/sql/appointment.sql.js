// Imports
const { Appointment, AppointmentStatusHistory } = require('./models')

const toPlain = (instance) => (instance ? instance.get({ plain: true }) : null)

// Code
class AppointmentDaoSql {

    get = async () => {
        const rows = await Appointment.findAll({
            order: [['fecha', 'DESC'], ['hora', 'DESC']],
        })
        return rows.map((row) => row.get({ plain: true }))
    }

    getById = async (id) => {
        const row = await Appointment.findByPk(id)
        return toPlain(row)
    }

    getByDate = async (fecha) => {
        const rows = await Appointment.findAll({
            where: { fecha },
            order: [['hora', 'ASC']],
        })
        return rows.map((row) => row.get({ plain: true }))
    }

    getByDateRange = async (fechaInicio, fechaFin) => {
        const rows = await Appointment.findAll({
            where: {
                fecha: {
                    [require('sequelize').Op.between]: [fechaInicio, fechaFin],
                },
            },
            order: [['fecha', 'DESC'], ['hora', 'DESC']],
        })
        return rows.map((row) => row.get({ plain: true }))
    }

    getByPaciente = async (idPaciente) => {
        const rows = await Appointment.findAll({
            where: { idPaciente },
            order: [['fecha', 'DESC'], ['hora', 'DESC']],
        })
        return rows.map((row) => row.get({ plain: true }))
    }

    create = async (newAppointment) => {
        const created = await Appointment.create({
            fecha: newAppointment.fecha,
            hora: newAppointment.hora,
            duracionMinutos: Number(newAppointment.duracionMinutos) || 30,
            idPaciente: newAppointment.idPaciente || null,
            nombrePaciente: newAppointment.nombrePaciente,
            estado: newAppointment.estado || 'pendiente',
            notasPublicas: newAppointment.notasPublicas || null,
            notasPrivadas: newAppointment.notasPrivadas || null,
            idUsuarioCarga: newAppointment.idUsuarioCarga || null,
        })
        return toPlain(created)
    }

    update = async (id, updatedAppointment) => {
        const current = await this.getById(id)
        if (!current) return null

        await Appointment.update(
            {
                fecha: updatedAppointment.fecha ?? current.fecha,
                hora: updatedAppointment.hora ?? current.hora,
                duracionMinutos: Number(updatedAppointment.duracionMinutos ?? current.duracionMinutos ?? 30),
                idPaciente: updatedAppointment.idPaciente ?? current.idPaciente,
                nombrePaciente: updatedAppointment.nombrePaciente ?? current.nombrePaciente,
                estado: updatedAppointment.estado ?? current.estado,
                notasPublicas: updatedAppointment.notasPublicas ?? current.notasPublicas,
                notasPrivadas: updatedAppointment.notasPrivadas ?? current.notasPrivadas,
                fechaActualizacion: new Date(),
            },
            { where: { id: Number(id) } }
        )
        return this.getById(id)
    }

    updateStatus = async (id, nuevoEstado) => {
        await Appointment.update(
            {
                estado: nuevoEstado,
                fechaActualizacion: new Date(),
            },
            { where: { id: Number(id) } }
        )
        return this.getById(id)
    }

    delete = async (id) => {
        const deletedCount = await Appointment.destroy({ where: { id: Number(id) } })
        return { deletedCount }
    }
}

// Exports
module.exports = AppointmentDaoSql
