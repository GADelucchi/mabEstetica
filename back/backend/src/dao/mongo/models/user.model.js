// Imports
const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// Config
const collection = 'users';

// Schema
const userSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'roles',
    required: true
  },
  last_connection: Date
})

// Options config
userSchema.plugin(mongoosePaginate)
const userModel = model(collection, userSchema)

// Exports
module.exports = {
  userModel
}