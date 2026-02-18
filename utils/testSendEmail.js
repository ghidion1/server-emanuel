const sendEmail = require("./sendEmail");

sendEmail({
  to: process.env.ADMIN_EMAIL,
  subject: "Test email din backend Clinica Mobila",
  text: "Acesta este un email de test trimis automat din backend. Daca il vezi, trimiterea functioneaza!"
})
  .then(info => {
    console.log("Test email trimis cu succes:", info.response);
    process.exit(0);
  })
  .catch(err => {
    console.error("Eroare la trimitere test email:", err.message);
    process.exit(1);
  });
