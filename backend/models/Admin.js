// backend/models/Admin.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  username: { type: String, required: true, unique: true},
  passwordHash: { type: String, required: true },
  email: { type: String }
});

module.exports = mongoose.model('Admin', AdminSchema);
