import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.js';
import Product from './models/product.js'; // Vérifie que c'est bien product.js
import products from './productsData.js'; // Chemin vers ton fichier produits

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Quitte le process avec erreur
  }
};

const importData = async () => {
  try {
    // Supprime tous les utilisateurs et produits existants
    await User.deleteMany();
    await Product.deleteMany();

    // Crée un utilisateur admin
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'adminpassword',  // Attention : en prod, hasher le mot de passe !
      role: 'admin',              // Ou isAdmin: true selon ton modèle
    });

    // Associe chaque produit à l'adminUser en ajoutant user: adminUser._id
    const sampleProducts = products.map((product) => ({
      ...product,
      user: adminUser._id,
    }));

    // Insère tous les produits en base
    await Product.insertMany(sampleProducts);

    console.log('Admin user and products imported successfully!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};


// Lancer la connexion puis l'import
connectDB().then(importData);
