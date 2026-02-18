// utils/sendEmail.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,                    // ← foarte important
  secure: false,                // true doar pentru 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // App Password – NU parola contului!
  },
  tls: {
    // obligatoriu pe unele servere cloud
    rejectUnauthorized: false,  // doar temporar pentru test – elimină ulterior
  },
  // debug: true,               // decomentează pentru a vedea loguri detaliate
  // logger: true,
});

// Test la pornire (foarte util)
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to take our messages");
  }
});

async function sendEmail({ to, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"Clinica Mobila" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, "<br>"),
    });

    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
}

module.exports = sendEmail;