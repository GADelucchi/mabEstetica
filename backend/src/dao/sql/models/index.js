const { DataTypes } = require('sequelize')
const { sequelize } = require('../../../config/sequelize')

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id_rol',
    },
    nombreRol: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'roles',
    timestamps: false,
})

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id_usuario',
    },
    nombre: { type: DataTypes.STRING(50), allowNull: false },
    apellido: { type: DataTypes.STRING(35), allowNull: false },
    email: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_rol',
    },
    resetToken: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'reset_token',
    },
    resetTokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'reset_token_expiry',
    },
}, {
    tableName: 'usuarios',
    timestamps: false,
})

const ClinicalRecord = sequelize.define('ClinicalRecord', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    apellido: { type: DataTypes.STRING(100), allowNull: false },
    documento: { type: DataTypes.STRING(20), allowNull: false },
    sexo: { type: DataTypes.ENUM('Masculino', 'Femenino'), allowNull: false },
    fechaNacimiento: { type: DataTypes.DATEONLY, allowNull: false, field: 'fecha_nacimiento' },
    telefono: { type: DataTypes.STRING(20), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false },
    redes: { type: DataTypes.STRING(200), allowNull: true },
    direccion: { type: DataTypes.STRING(200), allowNull: false },
    ciudad: { type: DataTypes.STRING(100), allowNull: false },
    provincia: { type: DataTypes.STRING(100), allowNull: false },
    profesion: { type: DataTypes.STRING(100), allowNull: true },
    medioConocimiento: { type: DataTypes.STRING(150), allowNull: true, field: 'medio_conocimiento' },
    embarazo: { type: DataTypes.BOOLEAN, allowNull: true },
    cicloMenstrual: { type: DataTypes.ENUM('Regular', 'Irregular', 'No menstrua'), allowNull: true, field: 'ciclo_menstrual' },
    alteracionesHormonales: { type: DataTypes.TEXT, allowNull: true, field: 'alteraciones_hormonales' },
    vitaminas: { type: DataTypes.BOOLEAN, allowNull: true },
    vitaminasDetalle: { type: DataTypes.TEXT, allowNull: true, field: 'vitaminas_detalle' },
    anticonceptivos: { type: DataTypes.BOOLEAN, allowNull: true },
    anticonceptivosDetalle: { type: DataTypes.TEXT, allowNull: true, field: 'anticonceptivos_detalle' },
    hormonas: { type: DataTypes.BOOLEAN, allowNull: true },
    hormonasDetalle: { type: DataTypes.TEXT, allowNull: true, field: 'hormonas_detalle' },
    corticoides: { type: DataTypes.BOOLEAN, allowNull: true },
    corticoidesDetalle: { type: DataTypes.TEXT, allowNull: true, field: 'corticoides_detalle' },
    medicamentos: { type: DataTypes.BOOLEAN, allowNull: true },
    medicamentosDetalle: { type: DataTypes.TEXT, allowNull: true, field: 'medicamentos_detalle' },
    alergias: { type: DataTypes.BOOLEAN, allowNull: true },
    alergiasDetalle: { type: DataTypes.TEXT, allowNull: true, field: 'alergias_detalle' },
    cirugiasPrevias: { type: DataTypes.BOOLEAN, allowNull: true, field: 'cirugias_previas' },
    cirugiasPreviasDetalle: { type: DataTypes.TEXT, allowNull: true, field: 'cirugias_previas_detalle' },
    marcapasos: { type: DataTypes.BOOLEAN, allowNull: true },
    implantes: { type: DataTypes.BOOLEAN, allowNull: true },
    implantesDetalle: { type: DataTypes.TEXT, allowNull: true, field: 'implantes_detalle' },
    problemaPiel: { type: DataTypes.TEXT, allowNull: false, field: 'problema_piel' },
    desdeCuando: { type: DataTypes.STRING(100), allowNull: true, field: 'desde_cuando' },
    tratamientosPrevios: { type: DataTypes.TEXT, allowNull: true, field: 'tratamientos_previos' },
    reacciones: { type: DataTypes.TEXT, allowNull: true },
    fototipo: { type: DataTypes.STRING(100), allowNull: true },
    biotipo: { type: DataTypes.STRING(100), allowNull: true },
    acne: { type: DataTypes.STRING(100), allowNull: true },
    autorizacion: { type: DataTypes.BOOLEAN, allowNull: false, field: 'autorizacion_fotos' },
    declaracion: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'declaracion_veracidad' },
    firmaDigital: { type: DataTypes.TEXT, allowNull: false, field: 'firma_digital' },
    idUsuarioCarga: { type: DataTypes.INTEGER, allowNull: true, field: 'id_usuario_carga' },
    fechaCreacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'fecha_creacion' },
    fechaActualizacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'fecha_actualizacion' },
}, {
    tableName: 'fichas_principal',
    timestamps: false,
})

const DailyRecord = sequelize.define('DailyRecord', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    idFichaPrincipal: { type: DataTypes.INTEGER, allowNull: false, field: 'id_ficha_principal' },
    fechaSesion: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW, field: 'fecha_sesion' },
    horasSueno: { type: DataTypes.DECIMAL(4, 1), allowNull: true, field: 'horas_sueno' },
    ejercicio: { type: DataTypes.STRING(255), allowNull: true },
    exposicionSolar: { type: DataTypes.DECIMAL(4, 1), allowNull: true, field: 'exposicion_solar' },
    protectorSolar: { type: DataTypes.BOOLEAN, allowNull: true, field: 'protector_solar' },
    reaplicacion: { type: DataTypes.BOOLEAN, allowNull: true },
    aguaDiaria: { type: DataTypes.DECIMAL(5, 2), allowNull: true, field: 'agua_diaria' },
    alimentos: { type: DataTypes.ENUM('Bueno', 'Balanceado/Regular', 'Malo'), allowNull: true },
    estres: { type: DataTypes.STRING(255), allowNull: true },
    rutinaActual: { type: DataTypes.TEXT, allowNull: true, field: 'rutina_actual' },
    aspectos: { type: DataTypes.TEXT, allowNull: true },
    tratamientosHoy: { type: DataTypes.TEXT, allowNull: true, field: 'tratamientos_hoy' },
    rutinaDomiciliaria: { type: DataTypes.TEXT, allowNull: true, field: 'rutina_domiciliaria' },
    idUsuarioCarga: { type: DataTypes.INTEGER, allowNull: true, field: 'id_usuario_carga' },
    fechaCreacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'fecha_creacion' },
    fechaActualizacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'fecha_actualizacion' },
}, {
    tableName: 'fichas_diarias',
    timestamps: false,
})

User.belongsTo(Role, { foreignKey: 'role' })
Role.hasMany(User, { foreignKey: 'role' })
ClinicalRecord.belongsTo(User, { foreignKey: 'idUsuarioCarga' })
User.hasMany(ClinicalRecord, { foreignKey: 'idUsuarioCarga' })
DailyRecord.belongsTo(User, { foreignKey: 'idUsuarioCarga' })
User.hasMany(DailyRecord, { foreignKey: 'idUsuarioCarga' })
DailyRecord.belongsTo(ClinicalRecord, { foreignKey: 'idFichaPrincipal' })
ClinicalRecord.hasMany(DailyRecord, { foreignKey: 'idFichaPrincipal' })

const Appointment = sequelize.define('Appointment', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fecha: { type: DataTypes.DATEONLY, allowNull: false },
    hora: { type: DataTypes.TIME, allowNull: false },
    idPaciente: { type: DataTypes.INTEGER, allowNull: true, field: 'id_paciente' },
    nombrePaciente: { type: DataTypes.STRING(255), allowNull: false, field: 'nombre_paciente' },
    estado: { type: DataTypes.ENUM('pendiente', 'asistido', 'ausente'), allowNull: false, defaultValue: 'pendiente' },
    notasPublicas: { type: DataTypes.TEXT, allowNull: true, field: 'notas_publicas' },
    notasPrivadas: { type: DataTypes.TEXT, allowNull: true, field: 'notas_privadas' },
    idUsuarioCarga: { type: DataTypes.INTEGER, allowNull: true, field: 'id_usuario_carga' },
    fechaCreacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'fecha_creacion' },
    fechaActualizacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'fecha_actualizacion' },
}, {
    tableName: 'turnos',
    timestamps: false,
})

const AppointmentStatusHistory = sequelize.define('AppointmentStatusHistory', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    idTurno: { type: DataTypes.INTEGER, allowNull: false, field: 'id_turno' },
    estadoAnterior: { type: DataTypes.ENUM('pendiente', 'asistido', 'ausente'), allowNull: true, field: 'estado_anterior' },
    estadoNuevo: { type: DataTypes.ENUM('pendiente', 'asistido', 'ausente'), allowNull: false, field: 'estado_nuevo' },
    idUsuario: { type: DataTypes.INTEGER, allowNull: false, field: 'id_usuario' },
    razon: { type: DataTypes.TEXT, allowNull: true },
    fechaCreacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'fecha_creacion' },
}, {
    tableName: 'turno_historial',
    timestamps: false,
})

Appointment.belongsTo(User, { foreignKey: 'idUsuarioCarga' })
User.hasMany(Appointment, { foreignKey: 'idUsuarioCarga' })
Appointment.hasMany(AppointmentStatusHistory, { foreignKey: 'idTurno' })
AppointmentStatusHistory.belongsTo(Appointment, { foreignKey: 'idTurno' })
AppointmentStatusHistory.belongsTo(User, { foreignKey: 'idUsuario' })
User.hasMany(AppointmentStatusHistory, { foreignKey: 'idUsuario' })

module.exports = {
    sequelize,
    Role,
    User,
    ClinicalRecord,
    DailyRecord,
    Appointment,
    AppointmentStatusHistory,
}
