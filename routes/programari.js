const express = require("express");
const router = express.Router();
const { createProgramare, getProgramari } = require("../controllers/programariController");

router.post("/", createProgramare);
router.get("/", getProgramari);

module.exports = router;
