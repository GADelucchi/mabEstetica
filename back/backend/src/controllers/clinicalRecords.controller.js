// Imports
const { clinicalRecordService } = require("../services/index.service")

// Code
class ClinicalRecordController {
  getClinicalRecords = async () => await clinicalRecordService.get()

  getClinicalRecordById = async (crid) => await clinicalRecordService.getById(crid)

  getClinicalRecordByName = async (name) => await clinicalRecordService.getByName(name)

  getClinicalRecordByLastName = async (last_name) => await clinicalRecordService.getByLastName(last_name)

  getClinicalRecordByDni = async (dni) => await clinicalRecordService.getByDni(dni)

  createClinicalRecord = async (newClinicalRecord) => await clinicalRecordService.create(newClinicalRecord)

  updateClinicalRecord = async (crid, clinicalRecordToReplace) => await clinicalRecordService.update(crid, clinicalRecordToReplace)

  deleteClinicalRecord = async (crid) => await clinicalRecordService.delete(crid)
}

// Export
module.exports = new ClinicalRecordController()