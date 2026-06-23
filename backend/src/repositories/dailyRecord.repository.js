// Code
class DailyRecordRepository {
    constructor(dao) {
        this.dao = dao;
    }

    get = async () => await this.dao.get()

    getById = async (id) => await this.dao.getById(id)

    getByFichaPrincipal = async (idFichaPrincipal) => await this.dao.getByFichaPrincipal(idFichaPrincipal)

    create = async (newRecord) => await this.dao.create(newRecord)

    update = async (id, updatedRecord) => await this.dao.update(id, updatedRecord)

    delete = async (id) => await this.dao.delete(id)
}

// Exports
module.exports = { DailyRecordRepository }
