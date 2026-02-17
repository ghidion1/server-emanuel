// CommonJS
const express = require("express");
const cors = require("cors");
const pkg = require("pg");
const { Pool } = pkg;

const app = express();
app.use(express.json());

// --- CORS ---
app.use(cors({
  origin: 'https://emanuel-cioburciu.md',
  methods: ['GET','POST','PUT','DELETE'],
}));

// --- Pool PostgreSQL ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.post("/api/programari", async (req, res) => {
  console.log("BODY primit:", req.body); // DEBUG

  let { nume, prenume, specialitate, medic, data, ora, telefon, email, motiv, mesaj } = req.body;

  // --- VALIDARE DE BAZĂ ---
  if (!nume || !prenume || !specialitate || !medic || !data || !ora || !telefon) {
    return res.status(400).json({ message: "Lipsesc câmpuri obligatorii!" });
  }

  // --- Normalizare data și ora ---
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
  const timeRegex = /^\d{2}:\d{2}$/;       // HH:MM

  if (!dateRegex.test(data)) {
    return res.status(400).json({ message: "Data nu este în formatul corect YYYY-MM-DD" });
  }

  if (!timeRegex.test(ora)) {
    return res.status(400).json({ message: "Ora nu este în formatul corect HH:MM" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO programari 
       (nume, prenume, specialitate, medic, data, ora, telefon, email, motiv, mesaj)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [nume, prenume, specialitate, medic, data, ora, telefon, email || null, motiv || null, mesaj || null]
    );

    console.log("Programare primită:", result.rows[0]);
    res.status(200).json({ message: "Programare primită!", programare: result.rows[0] });
  } catch (err) {
    console.error("EROARE INSERT:", err);
    res.status(500).json({ message: "Eroare la adăugarea programării." });
  }
});



// --- GET pentru afișare programari ---
app.get("/api/programari", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM programari ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare la preluarea programărilor." });
  }
});

// --- Test server ---
app.get("/", (req, res) => {
  res.send("Serverul funcționează!");
});

// --- Pornire server ---
app.listen(process.env.PORT || 3000, () => console.log("Server pornit"));
