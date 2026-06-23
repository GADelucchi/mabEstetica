// Imports
const { DailyRecord } = require('./models')

const toBoolean = (value) => {
    if (value === 'Sí' || value === 'SI' || value === 'si' || value === true || value === 1 || value === '1') return true
    if (value === 'No' || value === 'NO' || value === 'no' || value === false || value === 0 || value === '0') return false
    return value
}

const normalizeRecord = (record) => {
    const next = { ...record }

    if ('protectorSolar' in next) next.protectorSolar = toBoolean(next.protectorSolar)
    if ('reaplicacion' in next) next.reaplicacion = toBoolean(next.reaplicacion)

    return next
}

// Code
class DailyRecordDaoSql {

    get = async () => {
        const rows = await DailyRecord.findAll()
        return rows.map((row) => row.get({ plain: true }))
    }

    getById = async (id) => {
        const row = await DailyRecord.findByPk(id)
        return row ? row.get({ plain: true }) : null
    }

    getByFichaPrincipal = async (idFichaPrincipal) => {
        const rows = await DailyRecord.findAll({
            where: { idFichaPrincipal: Number(idFichaPrincipal) },
            order: [['fechaSesion', 'DESC']],
        })
        return rows.map((row) => row.get({ plain: true }))
    }

    create = async (newRecord) => {
        const created = await DailyRecord.create(normalizeRecord(newRecord))
        return created.get({ plain: true })
    }

    update = async (id, updatedRecord) => {
        await DailyRecord.update(normalizeRecord(updatedRecord), { where: { id: Number(id) } })
        return this.getById(id)
    }

    delete = async (id) => {
        const deletedCount = await DailyRecord.destroy({ where: { id: Number(id) } })
        return { deletedCount }
    }
}

// Exports
module.exports = DailyRecordDaoSql
