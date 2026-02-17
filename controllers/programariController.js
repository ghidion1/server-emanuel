const Programare = require("../models/Programare");
const sendEmail = require("../utils/sendEmail");

const createProgramare = async (req, res) => {
  try {
    const programare = await Programare.create(req.body);

    // Trimite email catre admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "Noua programare",
      text: `
        Nume: ${programare.nume} ${programare.prenume}
        Specialitate: ${programare.specialitate}
        Medic: ${programare.medic}
        Data: ${programare.data} la ora ${programare.ora}
        Telefon: ${programare.telefon}
        Email: ${programare.email}
        Motiv: ${programare.motiv}
        Mesaj: ${programare.mesaj}
      `
    });

    res.status(201).json({ success: true, programare });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare server" });
  }
};

const getProgramari = async (req, res) => {
  try {
    const programari = await Programare.getAll();
    res.json(programari);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare server" });
  }
};

module.exports = { createProgramare, getProgramari };
