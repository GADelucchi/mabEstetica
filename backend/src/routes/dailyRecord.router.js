// Imports
const dailyRecordsController = require("../controllers/dailyRecords.controller");
const { RouterClass } = require("./routerClass");

// Code
class DailyRecordRouter extends RouterClass {
    init() {
        // GET /dailyRecords — todas las fichas diarias
        this.get("/", ["ADMIN", "SUPERADMIN"], async (req, res) => {
            try {
                const records = await dailyRecordsController.getDailyRecords();
                res.sendSuccess(records);
            } catch (error) {
                res.sendServerError(error);
            }
        });

        // GET /dailyRecords/ficha/:idFicha — por ficha principal
        this.get("/ficha/:idFicha", ["ADMIN", "SUPERADMIN"], async (req, res) => {
            try {
                const records = await dailyRecordsController.getDailyRecordsByFicha(req.params.idFicha);
                res.sendSuccess(records);
            } catch (error) {
                res.sendServerError(error);
            }
        });

        // GET /dailyRecords/:id — por id
        this.get("/:id", ["ADMIN", "SUPERADMIN"], async (req, res) => {
            try {
                const record = await dailyRecordsController.getDailyRecordById(req.params.id);
                if (!record) return res.status(404).send({ status: "Error", message: "Registro no encontrado" });
                res.sendSuccess(record);
            } catch (error) {
                res.sendServerError(error);
            }
        });

        // POST /dailyRecords — crear
        this.post("/", ["ADMIN", "SUPERADMIN"], async (req, res) => {
            try {
                const created = await dailyRecordsController.createDailyRecord(req.body);
                res.sendSuccess(created);
            } catch (error) {
                res.sendServerError(error);
            }
        });

        // PUT /dailyRecords/:id — actualizar
        this.put("/:id", ["ADMIN", "SUPERADMIN"], async (req, res) => {
            try {
                const updated = await dailyRecordsController.updateDailyRecord(req.params.id, req.body);
                res.sendSuccess(updated);
            } catch (error) {
                res.sendServerError(error);
            }
        });

        // DELETE /dailyRecords/:id — eliminar
        this.delete("/:id", ["ADMIN", "SUPERADMIN"], async (req, res) => {
            try {
                const result = await dailyRecordsController.deleteDailyRecord(req.params.id);
                res.sendSuccess(result);
            } catch (error) {
                res.sendServerError(error);
            }
        });
    }
}

// Exports
module.exports = DailyRecordRouter;
