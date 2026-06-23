// Imports
const { Router } = require('express')
const SessionRouter = require('./session.router')
const UsersRouter = require('./user.router')
const ClinicalRecordRouter = require('./clinicalRecord.router')
const DailyRecordRouter = require('./dailyRecord.router')

// Declaration
const router = Router()
const usersRouter = new UsersRouter()
const sessionRouter = new SessionRouter()
const clinicalRecordRouter = new ClinicalRecordRouter()
const dailyRecordRouter = new DailyRecordRouter()

// Code
router.use(`/users`, usersRouter.getRouter())

router.use(`/session`, sessionRouter.getRouter())

router.use(`/clinicalRecords`, clinicalRecordRouter.getRouter())

router.use(`/dailyRecords`, dailyRecordRouter.getRouter())

// Export
module.exports = router