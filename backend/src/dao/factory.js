// Imports
const { connectDB } = require('../config/serverConfig')
const UserDaoSql = require('./sql/user.sql')
const RoleDaoSql = require('./sql/role.sql')
const ClinicalRecordDaoSql = require('./sql/clinicalRecord.sql')
const DailyRecordDaoSql = require('./sql/dailyRecord.sql')

// Code
connectDB()

const UserDao = new UserDaoSql()
const RoleDao = new RoleDaoSql()
const ClinicalRecordDao = new ClinicalRecordDaoSql()
const DailyRecordDao = new DailyRecordDaoSql()

// Exports
module.exports = {
    UserDao,
    RoleDao,
    ClinicalRecordDao,
    DailyRecordDao
}