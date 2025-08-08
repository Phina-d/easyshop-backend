const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  getClients,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
} = require("../controllers/userController");

const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

// ✅ Authentification
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

// ✅ Gestion des utilisateurs protégée
router.get("/users", protect, authorizeRoles("admin", "closer"), getAllUsers);
router.get("/clients", protect, authorizeRoles("admin", "chef", "closer"), getClients);
router.get("/:id", protect, authorizeRoles("admin", "closer"), getUserById);
router.put("/:id", protect, authorizeRoles("admin"), updateUser);
router.put("/:id/role", protect, authorizeRoles("admin"), updateUserRole);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

module.exports = router;
