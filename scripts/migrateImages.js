// scripts/migrateImages.js
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");
require("dotenv").config();

// 1. Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 2. Chemins source (public/images) et destination (uploads)
const publicImagesPath = path.join(__dirname, "../public/images");
const uploadsPath = path.join(__dirname, "../uploads");

// 3. Lancer la migration
async function migrate() {
  try {
    const products = await Product.find({
      image: { $regex: "^/images/" },
    });

    for (const product of products) {
      const oldPath = path.join(publicImagesPath, path.basename(product.image));
      const newPath = path.join(uploadsPath, path.basename(product.image));
      const newImagePath = `/uploads/${path.basename(product.image)}`;

      // Vérifie que l’image existe dans /public/images
      if (fs.existsSync(oldPath)) {
        // Copie dans /uploads/
        fs.copyFileSync(oldPath, newPath);

        // Met à jour le champ image dans MongoDB
        product.image = newImagePath;
        await product.save();

        console.log(`✅ ${product.name} : ${oldPath} -> ${newImagePath}`);
      } else {
        console.warn(`❌ Fichier non trouvé pour ${product.name}: ${oldPath}`);
      }
    }

    console.log("🎉 Migration terminée !");
    process.exit();
  } catch (err) {
    console.error("Erreur pendant la migration :", err);
    process.exit(1);
  }
}

migrate();
