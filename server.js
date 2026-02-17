const express = require("express");
const app = express();
app.use(express.json());

// Exemplu de route corect
app.post("/api/programari", (req, res) => {
  console.log(req.body); // ca să vezi ce vine
  res.status(200).json({ message: "Programare primită!" });
});

app.listen(process.env.PORT || 3000, () => console.log("Server pornit"));
// În server.js sau app.js
app.get("/", (req, res) => {
  res.send("Serverul funcționează!");
});
