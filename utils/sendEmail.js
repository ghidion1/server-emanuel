const nodemailer = require("nodemailer");
require("dotenv").config();

// Configurare transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true pentru 465, false pentru alte porturi
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Test conexiune (optional)
transporter.verify((err, success) => {
  if (err) {
    console.error("⚠️  SMTP config eroare:", err.message);
  } else if (success) {
    console.log("✅ SMTP conectat cu succes");
  }
});

async function sendEmail({ to, subject, text, html }) {
  try {
    const mailOptions = {
      from: `"Clinic Mobila" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html: html || `<pre>${text}</pre>` // fallback dacă nu e HTML
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email trimis:", info.response);
    return info;
  } catch (err) {
    console.error("❌ Eroare trimitere email:", err.message);
    throw err;
  }
}

module.exports = sendEmail;
