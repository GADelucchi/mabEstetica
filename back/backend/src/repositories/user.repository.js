// Code
class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

get = async () => await this.dao.get()

getById = async (uid) => await this.dao.getById(uid)

getByEmail = async (email) => await this.dao.getByEmail(email)

create = async (newUser) => await this.dao.create(newUser)

update = async (email, updatedUser) => await this.dao.update(email, updatedUser)

updateLastConection = async (email) => await this.dao.updateLastConection(email)

delete = async (email) => await this.dao.delete(email)

findUsers = async (connectionLimit) => await this.dao.findUsers(connectionLimit)
}

// Exports
module.exports = {
    UserRepository
}