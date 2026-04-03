// Imports
const usersController = require("../controllers/users.controller");
const { RouterClass } = require("./routerClass");

// Code
class UserRouter extends RouterClass {
    init() {
        this.get('/', ['ADMIN', 'SUPERADMIN'], async (req, res) => {
            try {
                let users = await usersController.getUsers()

                if (users === null) {
                    throw new Error(error)
                }

                res.send({
                    users: users
                })
            } catch (error) {
                console.log(error)
            }
        })

        this.get('/:uid', ['ADMIN'], async (req, res) => {
            try {
                const { uid } = req.params
                const user = await usersController.getUserById(uid)

                if (user === null) {
                    throw new Error(error)
                }
                res.sendSuccess(user)
            } catch (error) {
                console.log(error)
            }
        })

        this.post('/', ['SUPERADMIN'], async (req, res) => {
            try {
                const newUser = req.body
                const user = await usersController.createUser(newUser)

                if (user === null) {
                    throw new Error(error)
                }
                res.sendSuccess(user)
            } catch (error) {
                console.log(error)
            }
        })

        this.put('/:uid', ['SUPERADMIN'], async (req, res) => {
            try {

            } catch (error) {
                console.log(error)
            }
        })

        this.delete('/:uid', ['ADMIN'], async (req, res) => {
            try {
                const { uid } = req.params
                const result = await usersController.deleteUser(uid)

                if (result === null) {
                    throw new Error(error)
                }
                res.sendSuccess(result)
            } catch (error) {
                console.log(error)
            }
        })
    }
}

// Exports
module.exports = UserRouter