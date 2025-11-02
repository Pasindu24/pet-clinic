// backend/models/Owner.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OwnerSchema = new Schema({
  name: { type: String, required: true },
  email: { type:String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  petType: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Owner', OwnerSchema);
