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
        text: `NOUA PROGRAMARE:\n\nPacient: ${nume} ${prenume}\nSpecialitate: ${specialitate}\nMedic: ${medic}\nData: ${data}\nOra: ${ora}\nTelefon: ${telefon}\nEmail: ${email || '-'}\nMotiv: ${motiv || '-'}\nMesaj: ${mesaj || '-'}\n\nVerifica dashboard pentru mai multe detalii.`
      }).catch(err => console.error("Email admin eroare:", err.message));
    }

    // Trimite email de confirmare/thank-you către client (dacă a furnizat email)
    if (email) {
      const clientSubject = `Clinica Mobila - Programarea ta a fost primită`;
      const clientText = `Bună ${nume} ${prenume},\n\nMulțumim că ai ales Clinica noastră. Programarea ta pentru ${specialitate} cu ${medic} a fost înregistrată pentru data ${data} la ora ${ora}. Vei fi contactat(ă) telefonic pentru confirmare.\n\nMulțumim,\nEchipa Clinica Mobila`;

      sendEmail({
        to: email,
        subject: clientSubject,
        text: clientText
      }).catch(err => console.error("Email client eroare:", err.message));
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
