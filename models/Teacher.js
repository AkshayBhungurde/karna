const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "class-teacher" },

  assignedClass: { type: String }, // E.g., "Class 5A"
});

module.exports = mongoose.model('Teacher', teacherSchema);
