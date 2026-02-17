import express from 'express';
import pool from '../db.js'; // importă conexiunea

const router = express.Router();

router.post('/api/programari', async (req, res) => {
  const { nume, prenume, specialitate, medic, data, ora, telefon, email, motiv, mesaj } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO programari (nume, prenume, specialitate, medic, data, ora, telefon, email, motiv, mesaj)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [nume, prenume, specialitate, medic, data, ora, telefon, email, motiv, mesaj]
    );

    res.json({ message: "Programarea a fost înregistrată!", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare la inserarea programării", error: err.message });
  }
});

export default router;
