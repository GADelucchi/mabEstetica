// Imports
const { Schema, model } = require('mongoose');

// Config
const collection = 'complementary_records';

// Schema
const complementaryRecordSchema = new Schema({
  fecha: Date,
  numeroFicha: String,
  biotipo: {
    type: String,
    required: true
  },
  fototipo: {
    type: String,
    required: true
  },
  acne: {
    type: String,
    required: true
  },
  
})

// Options config
const complementaryRecordModel = model(collection, complementaryRecordSchema);

// Exports
module.exports = {
  complementaryRecordModel
}