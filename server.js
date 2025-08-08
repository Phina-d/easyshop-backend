require('dotenv').config();

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

// Charger les variables d'environnement
dotenv.config();

// Importation des routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const emailRoutes = require("./routes/emailRoutes");  // chemin selon ton projet
const adminRoutes = require("./routes/adminRoutes");
const prospectRoutes = require("./routes/prospectRoutes");
const closerRoutes = require("./routes/closerRoutes");

const app = express(); // ⚠️ Déclaration de app AVANT utilisation

// Middleware CORS avec plusieurs origins autorisés
const allowedOrigins = [
  "http://localhost:3000",
  "https://easyshop-client.netlify.app", // ton frontend en ligne
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Middleware pour parser le JSON et les données URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pour accéder aux fichiers d'uploads (ex: images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Empêche de revenir en arrière avec le cache navigateur
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/prospects", prospectRoutes);
app.use("/api/closers", closerRoutes);

// Route de test racine
app.get("/", (req, res) => {
  res.send("✅ API EasyShop en ligne !");
});

// Connexion à la base de données puis lancement du serveur
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à la base de données :", err);
  });
// test commit
