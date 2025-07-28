const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes API
app.use("/api/products", productRoutes);

// Route de test pour éviter "Cannot GET /"
app.get('/', (req, res) => {
  res.send('API EasyShop est en cours d’exécution...');
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connecté à MongoDB");
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}).catch(err => {
  console.error("Erreur connexion MongoDB :", err);
});
