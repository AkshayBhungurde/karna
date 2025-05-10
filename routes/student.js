const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const { authMiddleware, teacherOnly } = require("../middleware/authMiddleware");

// Add student (teacher only)
router.post("/", authMiddleware, teacherOnly, async (req, res) => {
  const { name } = req.body;

  try {
    const student = new Student({
      name,
      className: req.user.className,
      createdBy: req.user._id,
    });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get students of the teacher’s class
router.get("/", authMiddleware, teacherOnly, async (req, res) => {
  try {
    const students = await Student.find({ className: req.user.className });
    res.json(students);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
