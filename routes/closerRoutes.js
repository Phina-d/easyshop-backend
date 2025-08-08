const express = require("express");
const router = express.Router();

// Exemple : GET /api/closers - liste des closers (vide pour l'instant)
router.get("/", (req, res) => {
  res.json({ message: "Liste des closers - à implémenter" });
});

module.exports = router;
