const pool = require("../config/db");

const Programare = {
  create: async (data) => {
    const query = `
      INSERT INTO programari 
      (nume, prenume, specialitate, medic, data, ora, telefon, email, motiv, mesaj) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`;
    const values = [
      data.nume, data.prenume, data.specialitate, data.medic,
      data.data, data.ora, data.telefon, data.email, data.motiv, data.mesaj
    ];
    const res = await pool.query(query, values);
    return res.rows[0];
  },

  getAll: async () => {
    const res = await pool.query("SELECT * FROM programari ORDER BY data DESC, ora ASC");
    return res.rows;
  },

  delete: async (id) => {
    const query = "DELETE FROM programari WHERE id = $1 RETURNING *";
    const res = await pool.query(query, [id]);
    return res.rows[0] || null;
  },

  updateStatus: async (id, status) => {
    const query = `
      UPDATE programari 
      SET status = $1, updated_at = NOW() 
      WHERE id = $2 
      RETURNING *
    `;
    const res = await pool.query(query, [status, id]);
    return res.rows[0] || null;
  }
};

module.exports = Programare;
