// Imports
const rolesController = require("../controllers/roles.controller");
const sessionController = require("../controllers/sessions.controller");
const usersController = require("../controllers/users.controller");
const { createHash, isValidPassword } = require("../utils/bcryptHash");
const { generateToken } = require("../utils/jwt");
const { RouterClass } = require("./routerClass");
const { enviroment } = require("../../process/config");
const { sendMail } = require("../utils/sendMail");
const crypto = require("crypto");

// Code
class SessionRouter extends RouterClass {
  init() {
    this.post("/login", ["PUBLIC"], async (req, res) => {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).send({
            status: "Error",
            message: "Email y contraseña son obligatorios",
          });
        }

        // console.log(email, password);

        const userDB = await usersController.getUserByEmail(email);

        // console.log("\n\nUsuario encontrado: " + JSON.stringify(userDB));

        // Validar usuario y contraseña
        const fakeHash = "$2b$12$6I2vVvQv4aLVj5j4uXjcUeh8n8swrfZo0M8N2X0jY7sPq2Mvw3mda";
        const hashedPassword = userDB?.password || fakeHash;
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
          id: userDB.id,
          nombre: userDB.nombre,
          apellido: userDB.apellido,
          email: userDB.email,
          role: role.nombreRol,
        }

        // console.log(tokenUser);

        const access_token = generateToken(tokenUser)
        // console.log(access_token);

        const isProduction = enviroment === "production";
        const SIX_HOURS_MS = 1000 * 60 * 60 * 6;

        res.cookie("accessToken", access_token, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "None" : "Lax",
          maxAge: SIX_HOURS_MS,
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
        return res.status(500).send({
          status: "Error",
          message: "No se pudo iniciar sesión",
        });
      }
    })

    this.post("/register", ["PUBLIC"], async (_req, res) => {
      return res.status(403).send({
        status: "Error",
        message: "El registro público está deshabilitado. Solicita el alta a un administrador.",
      });
    })

    this.post("/change-password", ["ADMIN", "SUPERADMIN", "PROFESIONAL", "PACIENTE"], async (req, res) => {
      try {
        const { currentPassword, newPassword } = req.body;
        const email = req.user?.email;

        if (!email) {
          return res.status(401).send({ status: "Error", message: "No se pudo identificar al usuario autenticado." });
        }

        if (!currentPassword || !newPassword) {
          return res.status(400).send({ status: "Error", message: "Contraseña actual y nueva contraseña son obligatorias." });
        }

        if (newPassword.length < 6) {
          return res.status(400).send({ status: "Error", message: "La nueva contraseña debe tener al menos 6 caracteres." });
        }

        const user = await usersController.getUserByEmail(email);
        if (!user) {
          return res.status(404).send({ status: "Error", message: "Usuario no encontrado." });
        }

        if (!isValidPassword(currentPassword, user.password)) {
          return res.status(400).send({ status: "Error", message: "La contraseña actual no es correcta." });
        }

        if (isValidPassword(newPassword, user.password)) {
          return res.status(400).send({ status: "Error", message: "La nueva contraseña debe ser distinta a la actual." });
        }

        await usersController.updateUser(email, { password: createHash(newPassword) });

        return res.status(200).send({ status: "Success", message: "Contraseña actualizada correctamente." });
      } catch (error) {
        console.log(error);
        return res.status(500).send({ status: "Error", message: "No se pudo actualizar la contraseña." });
      }
    })

    this.post("/logout", ["PUBLIC"], (req, res) => {
      const isProduction = enviroment === "production";
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        path: "/",
      });
      res.status(200).send({ status: "Success", message: "Sesión cerrada correctamente" });
    })

    // POST /session/forgot-password — envía email con link de reset
    this.post("/forgot-password", ["PUBLIC"], async (req, res) => {
      try {
        const { email } = req.body;
        if (!email) {
          return res.status(400).send({ status: "Error", message: "El email es obligatorio" });
        }

        const user = await usersController.getUserByEmail(email);

        // Respuesta genérica para no revelar si el email existe
        if (!user) {
          return res.status(200).send({ status: "Success", message: "Si el email existe, recibirás un correo con instrucciones." });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

        await usersController.setResetToken(email, token, expiry);

        const frontendUrl = enviroment === "production"
          ? "https://tu-dominio.com"
          : "http://localhost:5173";

        const resetLink = `${frontendUrl}/reset-password?token=${token}`;

        const html = `
          <h2>Recuperación de contraseña — MAB Estética</h2>
          <p>Hola ${user.nombre},</p>
          <p>Recibimos una solicitud para restablecer tu contraseña.</p>
          <p><a href="${resetLink}" style="background:#0d6efd;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">Restablecer contraseña</a></p>
          <p>Este enlace expira en 1 hora. Si no solicitaste el cambio, ignorá este mensaje.</p>
        `;

        await sendMail(email, "Recuperación de contraseña — MAB Estética", html);

        res.status(200).send({ status: "Success", message: "Si el email existe, recibirás un correo con instrucciones." });
      } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Error", message: "No se pudo procesar la solicitud." });
      }
    })

    // POST /session/reset-password — establece nueva contraseña con token
    this.post("/reset-password", ["PUBLIC"], async (req, res) => {
      try {
        const { token, password } = req.body;

        if (!token || !password) {
          return res.status(400).send({ status: "Error", message: "Token y contraseña son obligatorios." });
        }

        if (password.length < 6) {
          return res.status(400).send({ status: "Error", message: "La contraseña debe tener al menos 6 caracteres." });
        }

        const user = await usersController.getUserByResetToken(token);

        if (!user) {
          return res.status(400).send({ status: "Error", message: "Token inválido o expirado." });
        }

        if (new Date(user.resetTokenExpiry) < new Date()) {
          return res.status(400).send({ status: "Error", message: "El token expiró. Solicitá uno nuevo." });
        }

        await usersController.updateUser(user.email, { password: createHash(password) });
        await usersController.clearResetToken(user.email);

        res.status(200).send({ status: "Success", message: "Contraseña actualizada correctamente. Ya podés iniciar sesión." });
      } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Error", message: "No se pudo restablecer la contraseña." });
      }
    })
  }
}

// Exports
module.exports = SessionRouter