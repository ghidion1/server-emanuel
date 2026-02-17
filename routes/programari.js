const express = require("express");
const router = express.Router();

// handler valid:
router.post("/programari", (req, res) => {
  // logica ta
  res.json({ message: "OK" });
});

module.exports = router;
