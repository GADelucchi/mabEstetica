// Imports
const rolesController = require("../controllers/roles.controller");
const sessionController = require("../controllers/sessions.controller");
const usersController = require("../controllers/users.controller");
const { createHash, isValidPassword } = require("../utils/bcryptHash");
const { generateToken } = require("../utils/jwt");
const { RouterClass } = require("./routerClass");

// Code
class SessionRouter extends RouterClass {
  init() {
    this.post("/login", ["PUBLIC"], async (req, res) => {
      try {
        const { email, password } = req.body;

        // console.log(email, password);

        const userDB = await usersController.getUserByEmail(email);

        // console.log("\n\nUsuario encontrado: " + JSON.stringify(userDB));

        // Validar usuario y contraseña
        const fakeHash = "$2b$35$$2b$12$gCPLq5uNfwHPEM8z/gEFSuEjvg9YZ2y0M8yW403VhMC82h9iXcGFC";
        const hashedPassword = userDB ? userDB.password : fakeHash;
        const isPasswordValid = isValidPassword(password, hashedPassword);

        if (!userDB || !isPasswordValid) {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Retraso anti fuerza bruta
          return res.status(401).send({
            status: "Error",
            message: "Email o contraseña incorrectos"
          });
        }

        // Actualizar última conexión
        await usersController.updateLastConection(email);

        const role = await rolesController.getRoleById(userDB.role);

        // console.log(role);

        // Crear token
        const tokenUser = {
          nombre: userDB.nombre,
          apellido: userDB.apellido,
          email: userDB.email,
          role: role.nombreRol,
        }

        // console.log(tokenUser);

        const access_token = generateToken(tokenUser)
        // console.log(access_token);

        res.cookie("accessToken", access_token, {
          httpOnly: true,
          secure: true,
          sameSite: 'None',
          maxAge: 1000*60*60*24*2,
          path: "/",
        }).status(200).send({
          status: "Success",
          message: "Usuario logueado correctamente",
          payload: {
            nombre: userDB.nombre,
            apellido: userDB.apellido,
            email: userDB.email,
            role: role.nombreRol,
          },
          token: access_token
        });

      } catch (error) {
        console.log(error);
      }
    })

    this.post("/register", ["PUBLIC"], async (req, res) => {
      try {
        let {
          nombre,
          apellido,
          email,
          password
        } = req.body;

        const existUser = await usersController.getUserByEmail(email)

        if (existUser) {
          return res.send({
            status: "Error",
            message: "Email ya en uso"
          })
        }

        const userRole = await rolesController.getRoleByName("USER")

        // console.log(userRole._id);

        const newUser = {
          nombre,
          apellido,
          email,
          password: createHash(password),
          role: userRole._id
        }

        // console.log(newUser.password);

        let resultUser = await usersController.createUser(newUser)

        const tokenUser = {
          nombre: newUser.nombre,
          apellido: newUser.apellido,
          email: newUser.email,
          role: newUser.userRole,
        }

        const regiter_token = generateToken(tokenUser)

        res.status(200).send({
          status: "Success",
          message: "Usuario registrado correctamente",
          payload: resultUser,
          token: regiter_token
        })
      } catch (error) {
        console.log(error);
      }
    })
  }
}

// Exports
module.exports = SessionRouter