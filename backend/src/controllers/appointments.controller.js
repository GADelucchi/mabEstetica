// Imports
const { appointmentService, appointmentStatusHistoryService } = require("../services/index.service")

// Code
class AppointmentController {
    getAppointments = async () => await appointmentService.get()

    getAppointmentById = async (id) => await appointmentService.getById(id)

    getAppointmentsByDate = async (fecha) => await appointmentService.getByDate(fecha)

    getAppointmentsByDateRange = async (fechaInicio, fechaFin) => 
        await appointmentService.getByDateRange(fechaInicio, fechaFin)

    getAppointmentsByPaciente = async (idPaciente) => 
        await appointmentService.getByPaciente(idPaciente)

    createAppointment = async (newAppointment) => 
        await appointmentService.create(newAppointment)

    updateAppointment = async (id, updatedAppointment) => 
        await appointmentService.update(id, updatedAppointment)

    updateAppointmentStatus = async (id, nuevoEstado, idUsuario, razon = null) => {
        const appointmentAnterior = await appointmentService.getById(id)
        const resultado = await appointmentService.updateStatus(id, nuevoEstado)
        
        // Registrar en historial
        await appointmentStatusHistoryService.create({
            idTurno: id,
            estadoAnterior: appointmentAnterior?.estado || null,
            estadoNuevo: nuevoEstado,
            idUsuario,
            razon,
        })
        
        return resultado
    }

    deleteAppointment = async (id) => await appointmentService.delete(id)

    getAppointmentHistory = async (idTurno) => 
        await appointmentStatusHistoryService.getByAppointmentId(idTurno)
}

// Exports
module.exports = new AppointmentController()
