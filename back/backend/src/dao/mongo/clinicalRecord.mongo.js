// Imports
const { clinicalRecordModel } = require(`./models/clinicalRecord.model`)

// Code
class ClinicalRecordDaoMongo {
    constructor() {
        this.model = clinicalRecordModel
    }

    get = async () => await this.model.find({})

    getById = async (crid) => await this.model.findOne({ _id: crid })

    getByName = async (name) => await this.model.findOne({ nombre: name }).lean()

    getByLastName = async (last_name) => await this.model.findOne({ apellido: last_name }).lean()

    getByDni = async (dni) => await this.model.findOne({ documento: dni }).lean()

    create = async (newClinicalRecord) => await this.model.create(newClinicalRecord)

    update = async (crid, updatedClinicalRecord) => await this.model.updateOne({ _id: crid }, updatedClinicalRecord)

    delete = async (crid) => await this.model.deleteOne({ _id: crid })
}

// Exports
module.exports = ClinicalRecordDaoMongo