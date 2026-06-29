// Imports
const appointmentsController = require("../controllers/appointments.controller");
const { RouterClass } = require("./routerClass");

const toMinutes = (hora) => {
    if (!hora) return 0;
    const parts = String(hora).split(":");
    const h = Number(parts[0] || 0);
    const m = Number(parts[1] || 0);
    return h * 60 + m;
};

const hasOverlap = ({ appointments, hora, duracionMinutos, ignoreId = null }) => {
    const start = toMinutes(hora);
    const end = start + Number(duracionMinutos || 30);

    return appointments.some((appointment) => {
        if (ignoreId && Number(appointment.id) === Number(ignoreId)) return false;

        const appointmentStart = toMinutes(appointment.hora);
        const appointmentEnd = appointmentStart + Number(appointment.duracionMinutos || 30);

        return start < appointmentEnd && appointmentStart < end;
    });
};

// Code
class AppointmentRouter extends RouterClass {
    init() {
        // GET /appointments — todos los turnos
        this.get("/", ["ADMIN", "SUPERADMIN", "PROFESIONAL"], async (req, res) => {
            try {
                const appointments = await appointmentsController.getAppointments();
                res.sendSuccess(appointments);
            } catch (error) {
                res.sendServerError(error);
            }
        });

        // GET /appointments/by-date/:fecha — por fecha (YYYY-MM-DD)
        this.get("/by-date/:fecha", ["ADMIN", "SUPERADMIN", "PROFESIONAL"], async (req, res) => {
            try {
                const appointments = await appointmentsController.getAppointmentsByDate(req.params.fecha);
                res.sendSuccess(appointments);
            } catch (error) {
                res.sendServerError(error);
            }
        });

        // GET /appointments/range — por rango de fechas
        this.get("/range", ["ADMIN", "SUPERADMIN", "PROFESIONAL"], async (req, res) => {
            try {
                const { fechaInicio, fechaFin } = req.query;
                if (!fechaInicio || !fechaFin) {
                    return res.status(400).send({ 
                        status: "Error", 
                        message: "Requiere fechaInicio y fechaFin en query" 
                    });
                }
                const appointments = await appointmentsController.getAppointmentsByDateRange(
                    fechaInicio, 
                    fechaFin
                );
                res.sendSuccess(appointments);
            } catch (error) {
                res.sendServerError(error);
            }
        });

        // GET /appointments/paciente/:idPaciente — por paciente
        this.get("/paciente/:idPaciente", ["ADMIN", "SUPERADMIN", "PROFESIONAL"], async (req, res) => {
            try {
                const appointments = await appointmentsController.getAppointmentsByPaciente(
                    req.params.idPaciente
                );
                res.sendSuccess(appointments);
            } catch (error) {
                res.sendServerError(error);
            }
        });

        // GET /appointments/history/:id — historial de cambios de estado
        this.get("/history/:id", ["ADMIN", "SUPERADMIN", "PROFESIONAL"], async (req, res) => {
            try {
                const history = await appointmentsController.getAppointmentHistory(req.params.id);
                res.sendSuccess(history);
            } catch (error) {
                res.sendServerError(error);
            }
        });

        // GET /appointments/:id — por id
        this.get("/:id", ["ADMIN", "SUPERADMIN", "PROFESIONAL"], async (req, res) => {
            try {
                const appointment = await appointmentsController.getAppointmentById(req.params.id);
                if (!appointment) {
                    return res.status(404).send({ 
                        status: "Error", 
                        message: "Turno no encontrado" 
                    });
                }
                res.sendSuccess(appointment);
            } catch (error) {
                res.sendServerError(error);
            }
        });

        // POST /appointments — crear
        this.post("/", ["ADMIN", "SUPERADMIN", "PROFESIONAL"], async (req, res) => {
            try {
                const { fecha, hora, nombrePaciente, duracionMinutos } = req.body;
                if (!fecha || !hora || !nombrePaciente) {
                    return res.status(400).send({ 
                        status: "Error", 
                        message: "Requiere fecha, hora y nombrePaciente" 
                    });
                }

                const duration = Number(duracionMinutos || 30);
                if (!Number.isFinite(duration) || duration < 5 || duration > 480) {
                    return res.status(400).send({
                        status: "Error",
                        message: "Duración inválida. Debe estar entre 5 y 480 minutos.",
                    });
                }

                const appointmentsByDate = await appointmentsController.getAppointmentsByDate(fecha);
                if (hasOverlap({ appointments: appointmentsByDate, hora, duracionMinutos: duration })) {
                    return res.status(409).send({
                        status: "Error",
                        message: "Ya existe un turno que se superpone en ese horario.",
                    });
                }

                const newAppointment = {
                    ...req.body,
                    duracionMinutos: duration,
                    idUsuarioCarga: req.user?.id || null,
                };
                const created = await appointmentsController.createAppointment(newAppointment);
                res.sendSuccess(created);
            } catch (error) {
                res.sendServerError(error);
            }
        });

        // PUT /appointments/:id — actualizar
        this.put("/:id", ["ADMIN", "SUPERADMIN", "PROFESIONAL"], async (req, res) => {
            try {
                const current = await appointmentsController.getAppointmentById(req.params.id);
                if (!current) {
                    return res.status(404).send({
                        status: "Error",
                        message: "Turno no encontrado",
                    });
                }

                const fecha = req.body.fecha || current.fecha;
                const hora = req.body.hora || current.hora;
                const duracionMinutos = Number(req.body.duracionMinutos ?? current.duracionMinutos ?? 30);

                if (!Number.isFinite(duracionMinutos) || duracionMinutos < 5 || duracionMinutos > 480) {
                    return res.status(400).send({
                        status: "Error",
                        message: "Duración inválida. Debe estar entre 5 y 480 minutos.",
                    });
                }

                const appointmentsByDate = await appointmentsController.getAppointmentsByDate(fecha);
                if (hasOverlap({
                    appointments: appointmentsByDate,
                    hora,
                    duracionMinutos,
                    ignoreId: req.params.id,
                })) {
                    return res.status(409).send({
                        status: "Error",
                        message: "Ya existe un turno que se superpone en ese horario.",
                    });
                }

                const updated = await appointmentsController.updateAppointment(
                    req.params.id, 
                    { ...req.body, fecha, hora, duracionMinutos }
                );
                res.sendSuccess(updated);
            } catch (error) {
                res.sendServerError(error);
            }
        });

        // PATCH /appointments/:id/status — cambiar estado
        this.patch("/:id/status", ["ADMIN", "SUPERADMIN", "PROFESIONAL"], async (req, res) => {
            try {
                const { nuevoEstado, razon } = req.body;
                if (!nuevoEstado || !['pendiente', 'asistido', 'ausente'].includes(nuevoEstado)) {
                    return res.status(400).send({ 
                        status: "Error", 
                        message: "Estado inválido. Debe ser: pendiente, asistido, ausente" 
                    });
                }
                const result = await appointmentsController.updateAppointmentStatus(
                    req.params.id,
                    nuevoEstado,
                    req.user?.id,
                    razon || null
                );
                res.sendSuccess(result);
            } catch (error) {
                res.sendServerError(error);
            }
        });

        // DELETE /appointments/:id — eliminar
        this.delete("/:id", ["ADMIN", "SUPERADMIN"], async (req, res) => {
            try {
                const result = await appointmentsController.deleteAppointment(req.params.id);
                res.sendSuccess(result);
            } catch (error) {
                res.sendServerError(error);
            }
        });
    }
}

// Exports
module.exports = AppointmentRouter;
