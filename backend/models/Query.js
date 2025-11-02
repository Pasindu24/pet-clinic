// backend/models/Query.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuerySchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'Owner', required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String }, // disease, vaccine, food...
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Query', QuerySchema);
