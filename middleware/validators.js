// Middleware validators pentru programări

const validateProgramareInput = (req, res, next) => {
  const { nume, prenume, specialitate, medic, data, ora, telefon, email } = req.body;

  // Verificări obligatorii
  if (!nume || !nume.trim()) {
    return res.status(400).json({ message: "Completează numele!" });
  }

  if (!prenume || !prenume.trim()) {
    return res.status(400).json({ message: "Completează prenumele!" });
  }

  if (!specialitate || !specialitate.trim()) {
    return res.status(400).json({ message: "Selectează specialitatea!" });
  }

  if (!medic || !medic.trim()) {
    return res.status(400).json({ message: "Selectează medicul!" });
  }

  if (!data) {
    return res.status(400).json({ message: "Alege data programării!" });
  }

  if (!ora) {
    return res.status(400).json({ message: "Alege ora programării!" });
  }

  if (!telefon || !telefon.trim()) {
    return res.status(400).json({ message: "Introducă un telefon!" });
  }

  // Validări format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(data)) {
    return res.status(400).json({ message: "Format dată invalid (YYYY-MM-DD)" });
  }

  const timeRegex = /^\d{2}:\d{2}$/;
  if (!timeRegex.test(ora)) {
    return res.status(400).json({ message: "Format oră invalid (HH:MM)" });
  }

  const phoneRegex = /^[0-9+\-\s()]{6,20}$/;
  if (!phoneRegex.test(telefon)) {
    return res.status(400).json({ message: "Telefon invalid" });
  }

  // Email validare (dacă e completat)
  if (email && email.trim()) {
    const emailRegex = /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email invalid" });
    }
  }

  next();
};

module.exports = { validateProgramareInput };
