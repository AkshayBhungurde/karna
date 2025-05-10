const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String, required: true },
  parentName: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  grade: { type: String, required: true },
  educationYear: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Approved'],
    default: 'Pending',
  },
  
}, { timestamps: true });

module.exports = mongoose.model('Admission', admissionSchema);
