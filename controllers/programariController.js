const Programare = require("../models/Programare");
const sendEmail = require("../utils/sendEmail");

const createProgramare = async (req, res) => {
  try {
    const { nume, prenume, specialitate, medic, data, ora, telefon, email, motiv, mesaj } = req.body;

    // Crează programarea în baza de date
    const programare = await Programare.create({
      nume: nume.trim(),
      prenume: prenume.trim(),
      specialitate,
      medic,
      data,
      ora,
      telefon,
      email: email?.trim() || null,
      motiv: motiv?.trim() || null,
      mesaj: mesaj?.trim() || null
    });

    // Trimite notificare email administratorului (non-blocking)
    if (process.env.ADMIN_EMAIL) {
      sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `📅 Noua programare - ${specialitate}`,
        text: `
NOUA PROGRAMARE:

Pacient: ${nume} ${prenume}
Specialitate: ${specialitate}
Medic: ${medic}
Data: ${data}
Ora: ${ora}
Telefon: ${telefon}
Email: ${email || '-'}
Motiv: ${motiv || '-'}
Mesaj: ${mesaj || '-'}

---
Verifica dashboard pentru mai multe detalii.
        `
      }).catch(err => console.error("Email admin eroare:", err.message));
    }

    return res.status(201).json({
      message: "Programarea a fost trimisă cu succes! Vei fi contactat(ă) telefonic pentru confirmare.",
      data: programare
    });

  } catch (err) {
    console.error("❌ Eroare createProgramare:", err);
    return res.status(500).json({
      message: "Eroare la salvarea programării. Te rugăm să încerci din nou.",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

const getProgramari = async (req, res) => {
  try {
    const programari = await Programare.getAll();
    res.json(programari);
  } catch (err) {
    console.error("❌ Eroare getProgramari:", err);
    res.status(500).json({
      message: "Eroare la preluarea programărilor"
    });
  }
};

module.exports = { createProgramare, getProgramari };
