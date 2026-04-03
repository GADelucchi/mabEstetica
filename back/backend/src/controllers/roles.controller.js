// Imports
const { roleService } = require('../services/index.service')

// Code
class RoleController {
  getRoles = async () => await roleService.get()

  getRoleByName = async (name) => await roleService.getByName(name)

  getRoleById = async (rid) => await roleService.getById(rid)

  createRole = async (newRole) => await roleService.create(newRole)

  updateRole = async (rid, roleToReplace) => await roleService.update(rid, roleToReplace)

  deleteRole = async (rid) => await roleService.delete(rid)
}

// Exports
module.exports = new RoleController()