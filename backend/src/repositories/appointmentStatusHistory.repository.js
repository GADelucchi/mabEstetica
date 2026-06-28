// Code
class AppointmentStatusHistoryRepository {
    constructor(dao) {
        this.dao = dao;
    }

    get = async () => await this.dao.get()

    getById = async (id) => await this.dao.getById(id)

    getByAppointmentId = async (idTurno) => await this.dao.getByAppointmentId(idTurno)

    create = async (newHistory) => await this.dao.create(newHistory)

    delete = async (id) => await this.dao.delete(id)
}

// Exports
module.exports = { AppointmentStatusHistoryRepository }
