const express = require('express');
const { createProgramare, getProgramari } = require('../controllers/programariController');
const { validateProgramareInput } = require('../middleware/validators');

const router = express.Router();

// GET: Preluează toate programările
router.get('/', getProgramari);

// POST: Crează o nouă programare (cu validare middleware)
router.post('/', validateProgramareInput, createProgramare);

module.exports = router;
