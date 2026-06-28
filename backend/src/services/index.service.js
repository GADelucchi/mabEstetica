// Imports
const { UserDao, RoleDao, ClinicalRecordDao, DailyRecordDao, AppointmentDao, AppointmentStatusHistoryDao } = require('../dao/factory');
const { UserRepository } = require('../repositories/user.repository');
const { RoleRepository } = require('../repositories/role.repository');
const { ClinicalRecordRepository } = require('../repositories/clinicalRecord.repository');
const { DailyRecordRepository } = require('../repositories/dailyRecord.repository');
const { AppointmentRepository } = require('../repositories/appointment.repository');
const { AppointmentStatusHistoryRepository } = require('../repositories/appointmentStatusHistory.repository');

// Code
const userService = new UserRepository(UserDao)
const roleService = new RoleRepository(RoleDao)
const clinicalRecordService = new ClinicalRecordRepository(ClinicalRecordDao)
const dailyRecordService = new DailyRecordRepository(DailyRecordDao)
const appointmentService = new AppointmentRepository(AppointmentDao)
const appointmentStatusHistoryService = new AppointmentStatusHistoryRepository(AppointmentStatusHistoryDao)

// Exports
module.exports = {
    userService,
    roleService,
    clinicalRecordService,
    dailyRecordService,
    appointmentService,
    appointmentStatusHistoryService,
}