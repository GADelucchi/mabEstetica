// Imports
const { persistence } = require("../../process/config");
const { connectDB } = require("../config/serverConfig");

// Variables
let UserDao
let RoleDao
let ClinicalRecordDao

// Code
switch (persistence) {
  case 'MONGO':
    connectDB()
    const UserDaoMongo = require('./mongo/user.mongo')
    const RoleDaoMongo = require('./mongo/role.mongo')
    const ClinicalRecordDaoMongo = require('./mongo/clinicalRecord.mongo')

    UserDao = new UserDaoMongo();
    RoleDao = new RoleDaoMongo();
    ClinicalRecordDao = new ClinicalRecordDaoMongo();
    break;

  case 'FILE':
    const UserDaoFile = require('./file/user.file')
    const RoleDaoFile = require('./file/role.file')

    UserDao = UserDaoFile
    RoleDao = RoleDaoFile
    break;

  case 'SQL':
    const UserDaoSql = require('./sql/user.sql')
    const RoleDaoSql = require('./sql/role.sql')

    UserDao = UserDaoSql
    RoleDao = RoleDaoSql
    break;

  default:
    break;
}

//Exports
module.exports = {
  UserDao,
  RoleDao,
  ClinicalRecordDao
}