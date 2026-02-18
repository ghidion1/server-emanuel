const Programare = require("../models/Programare");

// Hardcoded admin credentials (pe producție folosește database)
// ⚠️ CHANGE THESE IMMEDIATELY IN PRODUCTION
const ADMIN_CREDENTIALS = {
  username: "dr_admin_clinic",
  password: "SecureP@ss2026!" // ⚠️ Change this in production!
};

// Login Admin
const loginAdmin = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username și password sunt obligatorii" });
  }

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    return res.status(200).json({
      message: "Login successful",
      token: "admin-token-" + Date.now(),
      user: { username, role: "admin" }
    });
  }

  return res.status(401).json({ message: "Username sau password incorect" });
};

// Get all appointments (admin)
const getAllProgramari = async (req, res) => {
  try {
    const programari = await Programare.getAll();
    res.json({
      success: true,
      count: programari.length,
      data: programari
    });
  } catch (err) {
    console.error("❌ Eroare getProgramari:", err);
    res.status(500).json({ message: "Eroare la preluarea programărilor" });
  }
};

// Delete appointment
const deleteProgramare = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID obligatoriu" });
    }

    const result = await Programare.delete(id);

    if (!result) {
      return res.status(404).json({ message: "Programare nu găsită" });
    }

    res.json({
      message: "Programare ștearsă cu succes",
      data: result
    });
  } catch (err) {
    console.error("❌ Eroare deleteProgramare:", err);
    res.status(500).json({ message: "Eroare la ștergerea programării" });
  }
};

// Update appointment status
const updateProgramareStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ message: "ID și status sunt obligatorii" });
    }

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status invalid. Accept: ${validStatuses.join(", ")}` });
    }

    const result = await Programare.updateStatus(id, status);

    if (!result) {
      return res.status(404).json({ message: "Programare nu găsită" });
    }

    res.json({
      message: "Status actualizat cu succes",
      data: result
    });
  } catch (err) {
    console.error("❌ Eroare updateProgramareStatus:", err);
    res.status(500).json({ message: "Eroare la actualizarea statusului" });
  }
};

module.exports = {
  loginAdmin,
  getAllProgramari,
  deleteProgramare,
  updateProgramareStatus
};
