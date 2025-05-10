const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact: { type: String, required: true },
  role: { type: String, enum: ['admin'], required: true, default: 'admin' },
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
