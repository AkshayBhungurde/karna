const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  rollNumber: String,
  className: String, // Must match the teacher's assignedClass
  // other fields...
});

module.exports = mongoose.model("Student", studentSchema);
