const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // ✅ MISSING IMPORT FIXED

const Admission = require("../models/Admission");  // Assume Admission schema is defined
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");
const Teacher = require('../models/Teacher');


// Get all admissions
router.get("/admissions", authMiddleware, adminOnly, async (req, res) => {
  try {
    const admissions = await Admission.find();
    res.json(admissions);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Add a new admission
router.post("/admissions", authMiddleware, adminOnly, async (req, res) => {
  const { name, className, dob } = req.body;
  try {
    const newAdmission = new Admission({ name, className, dob });
    await newAdmission.save();
    res.status(201).json(newAdmission);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Delete admission by ID
router.delete("/admissions/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) return res.status(404).json({ msg: "Admission not found" });

    await admission.remove();
    res.json({ msg: "Admission removed" });
  } catch (err) {
    res.status(500).send("Server error");
  }
});




// Register a new class teacher
router.post('/register-teacher', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, password, assignedClass } = req.body;

    const existing = await Teacher.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      assignedClass,
    });

    await newTeacher.save();

    res.status(201).json({ message: 'Teacher registered successfully' });
  } catch (error) {
    console.error('Register Teacher Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
