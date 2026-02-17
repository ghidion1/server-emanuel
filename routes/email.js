const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/sendEmail');

router.post('/', async (req, res) => {
  const { to, subject, text, html } = req.body;
  try {
    await sendEmail({ to, subject, text, html });
    res.json({ message: 'Email trimis' });
  } catch (err) {
    res.status(500).json({ message: 'Eroare trimitere email' });
  }
});

module.exports = router;
