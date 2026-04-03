// Imports
const clinicalRecordsController = require("../controllers/clinicalRecords.controller");
const { RouterClass } = require("./routerClass");


//Code
class ClinicalRecordRouter extends RouterClass {
  init() {
    this.get("/", ["ADMIN", "SUPERADMIN"], async (req, res) => {
      try {
        const clinicalRecords = await clinicalRecordsController.getClinicalRecords();
        res.sendSuccess(clinicalRecords);
      } catch (error) {
        res.sendServerError(error);
      }
    });

    this.get("/:crid", ["ADMIN", "SUPERADMIN"], async (req, res) => {

    })

    this.get("/:name", ["ADMIN", "SUPERADMIN"], async (req, res) => {

    })

    this.get("/:last_name", ["ADMIN", "SUPERADMIN"], async (req, res) => {

    })

    this.get("/:dni", ["ADMIN", "SUPERADMIN"], async (req, res) => {

    })

    this.post("/", ["ADMIN", "SUPERADMIN"], async (req, res) => {
      try {
        const cookies = req.cookies;
        // console.log("Cookies:", JSON.stringify(cookies));

        const newClinicalRecord = req.body;

        // console.log("\n\nNew clinical record:", newClinicalRecord);

        const createdClinicalRecord = await clinicalRecordsController.createClinicalRecord(newClinicalRecord);
        // console.log("\n\nCreated clinical record:", createdClinicalRecord);

        res.sendSuccess(createdClinicalRecord);
      } catch (error) {
        res.sendServerError(error);
      }
    });

    this.put("/:crid", ["ADMIN", "SUPERADMIN"], async (req, res) => {
      try {
        const crid = req.params.crid;
        const clinicalRecordToReplace = req.body;
        const updatedClinicalRecord = await clinicalRecordsController.updateClinicalRecord(crid, clinicalRecordToReplace);
        res.sendSuccess(updatedClinicalRecord);
      } catch (error) {
        res.sendServerError(error);
      }
    });

    this.delete("/:crid", ["ADMIN", "SUPERADMIN"], async (req, res) => {
      try {
        const crid = req.params.crid;
        const deletedClinicalRecord = await clinicalRecordsController.deleteClinicalRecord(crid);
        res.sendSuccess(deletedClinicalRecord);
      } catch (error) {
        res.sendServerError(error);
      }
    });
  }
}

// Exports
module.exports = ClinicalRecordRouter;