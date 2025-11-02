// backend/models/Clinic.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClinicSchema = new Schema({
  name: { type: String, required: true },
  regNumber: { type: String },
  address: { type: String },
  phone: { type: String },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  specialization: { type: String },
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Clinic', ClinicSchema);
