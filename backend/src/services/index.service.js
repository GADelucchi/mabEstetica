// Imports
const { UserDao, RoleDao, ClinicalRecordDao, DailyRecordDao } = require('../dao/factory');
const { UserRepository } = require('../repositories/user.repository');
const { RoleRepository } = require('../repositories/role.repository');
const { ClinicalRecordRepository } = require('../repositories/clinicalRecord.repository');
const { DailyRecordRepository } = require('../repositories/dailyRecord.repository');

// Code
const userService = new UserRepository(UserDao)
const roleService = new RoleRepository(RoleDao)
const clinicalRecordService = new ClinicalRecordRepository(ClinicalRecordDao)
const dailyRecordService = new DailyRecordRepository(DailyRecordDao)

// Exports
module.exports = {
    userService,
    roleService,
    clinicalRecordService,
    dailyRecordService
}