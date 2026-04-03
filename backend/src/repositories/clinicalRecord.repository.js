// Code
class ClinicalRecordRepository {
  constructor(dao) {
      this.dao = dao;
  }

get = async () => await this.dao.get()

getById = async (crid) => await this.dao.getById(crid)

getByName = async (name) => await this.dao.getByName(name)

getByLastName = async (last_name) => await this.dao.getByLastName(last_name)

getByDni = async (dni) => await this.dao.getByDni(dni)

create = async (newClinicalRecord) => await this.dao.create(newClinicalRecord)

update = async (crid, updatedClinicalRecord) => await this.dao.update(crid, updatedClinicalRecord)

delete = async (crid) => await this.dao.delete(crid)

}

// Exports
module.exports = {
  ClinicalRecordRepository
}