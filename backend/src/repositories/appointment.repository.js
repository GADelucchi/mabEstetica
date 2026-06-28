// Code
class AppointmentRepository {
    constructor(dao) {
        this.dao = dao;
    }

    get = async () => await this.dao.get()

    getById = async (id) => await this.dao.getById(id)

    getByDate = async (fecha) => await this.dao.getByDate(fecha)

    getByDateRange = async (fechaInicio, fechaFin) => 
        await this.dao.getByDateRange(fechaInicio, fechaFin)

    getByPaciente = async (idPaciente) => await this.dao.getByPaciente(idPaciente)

    create = async (newAppointment) => await this.dao.create(newAppointment)

    update = async (id, updatedAppointment) => await this.dao.update(id, updatedAppointment)

    updateStatus = async (id, nuevoEstado) => await this.dao.updateStatus(id, nuevoEstado)

    delete = async (id) => await this.dao.delete(id)
}

// Exports
module.exports = { AppointmentRepository }
