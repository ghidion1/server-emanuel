import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;
const app = express();
app.use(express.json());

// --- CORS ---
app.use(cors({
  origin: ['https://emanuel-cioburciu.md','https://emanuel-cioburciu.md/programare'],
  methods: ['GET','POST','PUT','DELETE'],
}));


// --- Pool PostgreSQL ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// --- POST pentru programari ---
app.post("/api/programari", async (req, res) => {
  const { nume, prenume, specialitate, medic, data, ora, telefon, email, motiv, mesaj } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO programari (nume, prenume, specialitate, medic, data, ora, telefon, email, motiv, mesaj)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [nume, prenume, specialitate, medic, data, ora, telefon, email, motiv, mesaj]
    );
    console.log("Programare primită:", result.rows[0]);
    res.status(200).json({ message: "Programare primită!", programare: result.rows[0] });
  } catch (err) {
    console.error(err);
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
