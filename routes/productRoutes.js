const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  getProducts,
  getPublicProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
   makeAllVisible,
} = require("../controllers/productController");

const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

// ✅ Configuration de multer pour le téléchargement d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

/* -----------------------------------------
   ✅ ROUTES PRODUITS
------------------------------------------ */

// 🔓 Route PUBLIQUE pour lister les produits (accessible à tous - page d'accueil)
router.get("/public", getPublicProducts); // ✅ nouveau

router.get("/make-visible", makeAllVisible);
// ✅ Nouvelle route pour récupérer un seul produit par ID
router.get("/:id", getProductById);


// 🔐 Routes réservées à l’ADMIN
router.get("/", protect, authorizeRoles("admin"), getProducts);
router.post("/", protect, authorizeRoles("admin"), upload.single("image"), createProduct);
router.put("/:id", protect, authorizeRoles("admin"), upload.single("image"), updateProduct);
router.delete("/:id", protect, authorizeRoles("admin"), deleteProduct);


module.exports = router;
