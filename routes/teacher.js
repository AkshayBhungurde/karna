// const express = require("express");
// const router = express.Router();
// const Teacher = require("../models/Teacher");  // Assume Teacher schema is defined
// const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

// // Get all teachers
// router.get("/", authMiddleware, adminOnly, async (req, res) => {
//   try {
//     const teachers = await Teacher.find();
//     res.json(teachers);
//   } catch (err) {
//     res.status(500).send("Server error");
//   }
// });

// // Add a new teacher
// router.post("/", authMiddleware, adminOnly, async (req, res) => {
//   const { name, subject, className } = req.body;
//   try {
//     const newTeacher = new Teacher({ name, subject, className });
//     await newTeacher.save();
//     res.status(201).json(newTeacher);
//   } catch (err) {
//     res.status(500).send("Server error");
//   }
// });

// // Delete teacher by ID
// router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
//   try {
//     const teacher = await Teacher.findById(req.params.id);
//     if (!teacher) return res.status(404).json({ msg: "Teacher not found" });

//     await teacher.remove();
//     res.json({ msg: "Teacher removed" });
//   } catch (err) {
//     res.status(500).send("Server error");
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const { authMiddleware, teacherOnly } = require("../middleware/authMiddleware");

// Get students of teacher's assigned class
router.get("/my-class-students", authMiddleware, teacherOnly, async (req, res) => {
  try {
    const assignedClass = req.user.assignedClass;
    const students = await Student.find({ className: assignedClass });
    res.json(students);
  } catch (err) {
    console.error("Error fetching class students:", err);
    res.status(500).json({ msg: "Server error" });
  }
});





router.get("/teacher-profile", authMiddleware, teacherOnly, async (req, res) => {
  try {
    const teacher = req.user; // `authMiddleware` already attaches the teacher to req.user
    res.json({
      id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      assignedClass: teacher.assignedClass,
      // contact: teacher.contact,
      role: teacher.role
    });
  } catch (error) {
    console.error("Error fetching teacher profile:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
