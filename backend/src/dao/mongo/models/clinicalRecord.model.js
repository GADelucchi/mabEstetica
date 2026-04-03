// Imports
const { Schema, model } = require('mongoose');

// Config
const collection = 'clinical_records';

// Schema
const clinicalRecordSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
  },
  documento: {
    type: String,
    required: true
  },
  sexo: {
    type: String,
    required: true,
  },
  fechaNacimiento: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  redes: {
    type: String,
    required: false
  },
  direccion: {
    type: String,
    required: true
  },
  ciudad: {
    type: String,
    required: true
  },
  provincia: {
    type: String,
    required: true
  },
  profesion: {
    type: String,
    required: false
  },
  medioConocimiento: {
    type: String,
    required: false
  },
  embarazo: {
    type: String,
    required: false
  },
  cicloMenstrual: {
    type: String,
    required: false
  },
  alteracionesHormonales: {
    type: String,
    required: false
  },
  vitaminas: {
    type: String,
    required: false
  },
  vitaminasDetalle: {
    type: String,
    required: false
  },
  anticonceptivos: {
    type: String,
    required: false
  },
  anticonceptivosDetalle: {
    type: String,
    required: false
  },
  hormonas: {
    type: String,
    required: false
  },
  hormonasDetalle: {
    type: String,
    required: false
  },
  corticoides: {
    type: String,
    required: false
  },
  corticoidesDetalle: {
    type: String,
    required: false
  },
  medicamentos: {
    type: String,
    required: false
  },
  medicamentosDetalle: {
    type: String,
    required: false
  },
  alergias: {
    type: String,
    required: false
  },
  alergiasDetalle: {
    type: String,
    required: false
  },
  cirugiasPrevias: {
    type: String,
    required: false
  },
  cirugiasPreviasDetalle: {
    type: String,
    required: false
  },
  marcapasos: {
    type: String,
    required: false
  },
  implantes: {
    type: String,
    required: false
  },
  implantesDetalle: {
    type: String,
    required: false
  },
  problemaPiel: {
    type: String,
    required: false
  },
  desdeCuando: {
    type: String,
    required: false
  },
  tratamientosPrevios: {
    type: String,
    required: false
  },
  reacciones: {
    type: String,
    required: false
  },
  horasSueno: {
    type: String,
    required: false
  },
  ejercicio: {
    type: String,
    required: false
  },
  exposicionSolar: {
    type: String,
    required: false
  },
  protectorSolar: {
    type: String,
    required: false
  },
  reaplicacion: {
    type: String,
    required: false
  },
  aguaDiaria: {
    type: String,
    required: false
  },
  alimentos: {
    type: String,
    required: false
  },
  estres: {
    type: String,
    required: false
  },
  autorizacion: {
    type: String,
    required: true
  },
  declaracion: {
    type: Boolean,
    required: true
  },
  firmaDigital: {
    type: String,
    required: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

// Options config
const clinicalRecordModel = model(collection, clinicalRecordSchema);

// Exports
module.exports = {
  clinicalRecordModel
}