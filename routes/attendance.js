// // const express = require("express");
// // const router = express.Router();
// // const Attendance = require("../models/Attendance");
// // const Student = require("../models/Student");
// // const { authMiddleware, teacherOnly, adminOnly } = require("../middleware/authMiddleware");

// // // Mark attendance (teacher only)
// // router.post("/", authMiddleware, teacherOnly, async (req, res) => {
// //   const { studentId, status, date } = req.body;

// //   try {
// //     const student = await Student.findById(studentId);
// //     if (!student || student.className !== req.user.className) {
// //       return res.status(403).json({ msg: "Not allowed to mark this student" });
// //     }

// //     const existing = await Attendance.findOne({ student: studentId, date });
// //     if (existing) return res.status(400).json({ msg: "Attendance already marked for this date" });

// //     const record = new Attendance({
// //       student: studentId,
// //       date,
// //       status,
// //       markedBy: req.user._id,
// //     });

// //     await record.save();
// //     res.status(201).json(record);
// //   } catch (err) {
// //     res.status(500).send("Server error");
// //   }
// // });

// // // Get attendance (admin sees all, teacher sees own class)
// // router.get("/", authMiddleware, async (req, res) => {
// //   try {
// //     if (req.user.role === "admin") {
// //       const all = await Attendance.find().populate("student markedBy");
// //       return res.json(all);
// //     } else if (req.user.role === "teacher") {
// //       const students = await Student.find({ className: req.user.className }).select("_id");
// //       const ids = students.map(s => s._id);
// //       const records = await Attendance.find({ student: { $in: ids } }).populate("student");
// //       return res.json(records);
// //     }
// //   } catch (err) {
// //     res.status(500).send("Server error");
// //   }
// // });











// const express = require("express");
// const router = express.Router();
// const Attendance = require("../models/Attendance");
// const Student = require("../models/Student");
// const { authMiddleware, teacherOnly, adminOnly } = require("../middleware/authMiddleware");

// // Mark attendance (teacher only)
// router.post("/", authMiddleware, teacherOnly, async (req, res) => {
//   const { studentId, status, date } = req.body;

//   try {
//     const student = await Student.findById(studentId);
//     if (!student || student.className !== req.user.className) {
//       return res.status(403).json({ msg: "Not allowed to mark this student's attendance" });
//     }

//     const existing = await Attendance.findOne({ student: studentId, date });
//     if (existing) {
//       return res.status(400).json({ msg: "Attendance already marked for this date" });
//     }

//     const record = new Attendance({
//       student: studentId,
//       date,
//       status,
//       markedBy: req.user._id,
//     });

//     await record.save();
//     res.status(201).json({ msg: "Attendance marked successfully", record });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// });

// // Get attendance (admin sees all, teacher sees own class)
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     if (req.user.role === "admin") {
//       const all = await Attendance.find().populate("student markedBy");
//       return res.json(all);
//     } else if (req.user.role === "teacher") {
//       const students = await Student.find({ className: req.user.className }).select("_id");
//       const ids = students.map(s => s._id);
//       const records = await Attendance.find({ student: { $in: ids } }).populate("student");
//       return res.json(records);
//     } else {
//       return res.status(403).json({ msg: "Unauthorized access" });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const { authMiddleware, teacherOnly, adminOnly } = require("../middleware/authMiddleware");

// Mark attendance (teacher only)
router.post("/", authMiddleware, teacherOnly, async (req, res) => {
  const { studentId, status, date } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student || student.className !== req.user.className) {
      return res.status(403).json({ msg: "Not allowed to mark this student" });
    }

    const existing = await Attendance.findOne({ student: studentId, date });
    if (existing) return res.status(400).json({ msg: "Attendance already marked for this date" });

    const record = new Attendance({
      student: studentId,
      date,
      status,
      markedBy: req.user._id,
    });

    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get attendance (admin sees all, teacher sees own class)
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const all = await Attendance.find().populate("student markedBy");
      return res.json(all);
    } else if (req.user.role === "teacher") {
      const students = await Student.find({ className: req.user.className }).select("_id");
      const ids = students.map(s => s._id);
      const records = await Attendance.find({ student: { $in: ids } }).populate("student");
      return res.json(records);
    }
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
