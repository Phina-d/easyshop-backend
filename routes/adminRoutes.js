const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/adminController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

// Route protégée pour stats admin uniquement
// Comme ce routeur sera monté sur /api/admin, il suffit ici de mettre /stats
router.get(
  "/stats",
  protect,                   // Vérifie le token JWT
  authorizeRoles("admin", "chef"),   // Vérifie que le rôle est bien "admin"
  getDashboardStats
);

module.exports = router;
