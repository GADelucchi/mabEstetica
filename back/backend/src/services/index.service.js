// Imports
const { UserDao, RoleDao, ClinicalRecordDao} = require('../dao/factory');
const { UserRepository } = require('../repositories/user.repository');
const { RoleRepository } = require('../repositories/role.repository');
const { ClinicalRecordRepository } = require('../repositories/clinicalRecord.repository');

// Code
const userService = new UserRepository(UserDao)
const roleService = new RoleRepository(RoleDao)
const clinicalRecordService = new ClinicalRecordRepository(ClinicalRecordDao)

// Exports
module.exports = {
    userService,
    roleService,
    clinicalRecordService
}