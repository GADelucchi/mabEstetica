// Code
class RoleRepository {
  constructor(dao) {
      this.dao = dao
  }

  get = async () => await this.dao.get()

  getById = async (rid) => await this.dao.getById(rid)

  getByName = async (name) => await this.dao.getByName(name)

  create = async (newRole) => await this.dao.create(newRole)

  update = async (email, updatedRole) => await this.dao.update(email, updatedRole)

  delete = async (email) => await this.dao.delete(email)
}

// Exports
module.exports = {
    RoleRepository
}