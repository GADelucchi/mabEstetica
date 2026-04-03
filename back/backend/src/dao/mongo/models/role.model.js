// Imports
const { Schema, model } = require('mongoose');

// Config
const collection = 'roles';

// Schema
const roleSchema = new Schema({
    nombreRol: {
        type: String,
        required: true,
        unique: true
    }
});

// Options config
const roleModel = model(collection, roleSchema);

// Exports
module.exports = {
    roleModel
}