const express = require('express');
const router = express.Router();
const Admission = require('../models/Admission');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

// POST: Submit admission form (public)
// router.post('/application', async (req, res) => {
//   try {
//     const admission = new Admission(req.body);
//     await admission.save();
//     res.status(201).json({ message: 'Admission submitted successfully' });
//   } catch (error) {
//     console.error('Admission POST error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

router.post('/application', async (req, res) => {
  try {
    console.log("Incoming admission data:", req.body); // Debug incoming data
    const admission = new Admission(req.body);
    const saved = await admission.save();
    console.log("Saved admission:", saved);
    res.status(201).json({ message: 'Admission submitted successfully' });
  } catch (error) {
    console.error('Admission POST error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// GET: View all admission forms (admin only)
router.get('/applications', authMiddleware, adminOnly, async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.status(200).json(admissions);
    console.log(admissions)
  } catch (error) {
    console.error('Admission GET error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.patch('/application/:id/confirm', authMiddleware, adminOnly, async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) {
      return res.status(404).json({ msg: 'Admission not found' });
    }

    admission.status = 'Confirmed';
    await admission.save();

    res.json({ msg: 'Admission confirmed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// PATCH /api/admission/application/:id/approve
router.patch('/application/:id/approve', authMiddleware, adminOnly, async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    if (admission.status !== 'Confirmed') {
      return res.status(400).json({ msg: 'Only confirmed applications can be approved' });
    }

    admission.status = 'Approved';
    await admission.save();

    res.json({ msg: 'Application approved', admission });
  } catch (err) {
    console.error('Approve Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
