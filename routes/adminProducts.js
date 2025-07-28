// backend/routes/adminProducts.js

const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// Route GET pour récupérer tous les produits (admin)
router.get("/admin/produits", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des produits." });
  }
});

module.exports = router;
