// Imports
const { dailyRecordService } = require("../services/index.service")

// Code
class DailyRecordController {
    getDailyRecords = async () => await dailyRecordService.get()

    getDailyRecordById = async (id) => await dailyRecordService.getById(id)

    getDailyRecordsByFicha = async (idFichaPrincipal) => await dailyRecordService.getByFichaPrincipal(idFichaPrincipal)

    createDailyRecord = async (newRecord) => await dailyRecordService.create(newRecord)

    updateDailyRecord = async (id, updatedRecord) => await dailyRecordService.update(id, updatedRecord)

    deleteDailyRecord = async (id) => await dailyRecordService.delete(id)
}

// Exports
module.exports = new DailyRecordController()
