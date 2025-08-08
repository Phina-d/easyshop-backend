const express = require("express");
const router = express.Router();

// Exemple : GET /api/prospects - liste de prospects (vide pour l'instant)
router.get("/", (req, res) => {
  res.json({ message: "Liste des prospects - à implémenter" });
});

module.exports = router;
