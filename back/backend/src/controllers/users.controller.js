// Imports
const { userService } = require("../services/index.service")

// Code
class UserController {
  getUsers = async () => await userService.get()

  getUserByEmail = async (email) => await userService.getByEmail(email)

  getUserById = async (uid) => await userService.getById(uid)

  createUser = async (newUser) => await userService.create(newUser)

  updateUser = async (uid, userToReplace) => await userService.update(uid, userToReplace)

  deleteUser = async (uid) => await userService.delete(uid)

  findUsers = async (connectionLimit) => await userService.findUsers(connectionLimit)

  updateLastConection = async (email) => await userService.updateLastConection(email)
}

// Export
module.exports = new UserController()