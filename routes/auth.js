const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Assuming you have an Admin model
const Teacher = require('../models/Teacher')
//const authMiddleware = require('../middleware/authMiddleware'); // For protected routes
const authMiddleware = require ('../middleware/authMiddleware')


router.post("/register", register);
router.post("/login", login);

// POST: Register an admin
router.post('/register-admin', async (req, res) => {
  const { name, email, password, contact } = req.body;
console.log(req.body)
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save admin (with required 'name' and 'role')
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      contact,
      role: 'admin', // ✅ Add this line
    });

    const savedAdmin = await newAdmin.save();

    // Generate JWT token
    const token = jwt.sign({ id: savedAdmin._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ message: 'Admin registered successfully', token });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});









router.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { id: admin._id, role: 'admin' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});




// POST /api/teacher/login
router.post("/teacher-login", async (req, res) => {
  try {
    console.log("Login attempt:", req.body); // 👈 Add this

    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher || teacher.role !== "class-teacher") {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: teacher._id,
        role: "class-teacher",
        assignedClass: teacher.assignedClass,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        assignedClass: teacher.assignedClass,
      },
    });
  } catch (err) {
    console.error("Teacher login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});
 



module.exports = router;
