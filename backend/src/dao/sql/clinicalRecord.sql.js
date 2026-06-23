// Imports
const { ClinicalRecord } = require('./models')

const toPlain = (instance) => (instance ? instance.get({ plain: true }) : null)

const toBoolean = (value) => {
    if (value === 'Sí' || value === 'SI' || value === 'si' || value === true || value === 1 || value === '1') return true
    if (value === 'No' || value === 'NO' || value === 'no' || value === false || value === 0 || value === '0') return false
    return value
}

const normalizeRecord = (record) => {
    const next = { ...record }
    const booleanFields = [
        'embarazo', 'vitaminas', 'anticonceptivos', 'hormonas', 'corticoides',
        'medicamentos', 'alergias', 'cirugiasPrevias', 'marcapasos', 'implantes',
        'autorizacion', 'declaracion',
    ]

    booleanFields.forEach((field) => {
        if (field in next) next[field] = toBoolean(next[field])
    })

    return next
}

// Code
class ClinicalRecordDaoSql {

    get = async () => {
        const rows = await ClinicalRecord.findAll()
        return rows.map((row) => row.get({ plain: true }))
    }

    getById = async (id) => {
        const row = await ClinicalRecord.findByPk(id)
        return toPlain(row)
    }

    getByName = async (name) => {
        const row = await ClinicalRecord.findOne({ where: { nombre: name } })
        return toPlain(row)
    }

    getByLastName = async (last_name) => {
        const row = await ClinicalRecord.findOne({ where: { apellido: last_name } })
        return toPlain(row)
    }

    getByDni = async (dni) => {
        const row = await ClinicalRecord.findOne({ where: { documento: dni } })
        return toPlain(row)
    }

    create = async (newRecord) => {
        const created = await ClinicalRecord.create(normalizeRecord(newRecord))
        return toPlain(created)
    }

    update = async (id, updatedRecord) => {
        await ClinicalRecord.update(normalizeRecord(updatedRecord), { where: { id: Number(id) } })
        return this.getById(id)
    }

    delete = async (id) => {
        const deletedCount = await ClinicalRecord.destroy({ where: { id: Number(id) } })
        return { deletedCount }
    }
}

// Exports
module.exports = ClinicalRecordDaoSql
