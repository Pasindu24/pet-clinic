// backend/models/Response.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResponseSchema = new Schema({
  query: { type: Schema.Types.ObjectId, ref: 'Query', required: true },
  clinic: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Response', ResponseSchema);
