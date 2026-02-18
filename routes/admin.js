const express = require('express');
const {
  loginAdmin,
  getAllProgramari,
  deleteProgramare,
  updateProgramareStatus
} = require('../controllers/adminController');

const router = express.Router();

// POST: Admin login
router.post('/login', loginAdmin);

// GET: All appointments (admin dashboard)
router.get('/programari', getAllProgramari);

// DELETE: Delete appointment by ID
router.delete('/programari/:id', deleteProgramare);

// PUT: Update appointment status
router.put('/programari/:id/status', updateProgramareStatus);

module.exports = router;
