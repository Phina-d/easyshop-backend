README.md (pour ton dossier easyshop-backend/)

# 🛒 EasyShop - Backend API (MERN Stack)

Ce projet constitue le backend de l'application e-commerce **EasyShop**, développé avec **Node.js**, **Express**, **MongoDB** et **JWT**.

## 📦 Fonctionnalités

- Authentification des utilisateurs (inscription, connexion, JWT)
- Rôles : utilisateur standard et administrateur
- Gestion des produits : CRUD complet (admin uniquement)
- Middleware sécurisé (`protect`, `isAdmin`)
- Connexion à MongoDB Atlas
- Système de seed (admin + produits fictifs)
- Architecture MVC claire

---

## 🛠️ Technologies utilisées

- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- dotenv
- cors
- nodemon

---

## 🔧 Installation

1. **Cloner le repo :**

```bash
git clone https://github.com/votre-utilisateur/easyshop-backend.git
cd easyshop-backend
Installer les dépendances :


npm install
Configurer les variables d'environnement dans un fichier .env :


PORT=5000
MONGO_URI=votre_mongo_uri_atlas
JWT_SECRET=un_jwt_secret_complexe
Lancer le serveur en développement :


npm run dev
🚀 Seeder des données
Pour insérer un admin par défaut et des produits de démonstration :


node seeder.js
🔐 Routes principales
Authentification
POST /api/users/register → Créer un utilisateur

POST /api/users/login → Connexion + JWT

Produits
GET /api/products → Voir tous les produits

POST /api/products → Ajouter un produit (admin)

PUT /api/products/:id → Modifier (admin)

DELETE /api/products/:id → Supprimer (admin)


🗂️ Structure des dossiers

easyshop-backend/
│
├── controllers/
│   ├── productController.js
│   └── userController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── Product.js
│   └── User.js
│
├── routes/
│   ├── productRoutes.js
│   └── userRoutes.js
│
├── productsData.js       # Données fictives
├── seeder.js             # Seed initial (admin + produits)
├── server.js             # Point d’entrée
└── .env                  # Variables d’environnement (non commit)

✅ Etape connexion
→ Connecter ce backend à un front-end React (client EasyShop) pour une expérience complète (produits, panier, commandes, etc).



---

## 📄 Rapport Technique – EasyShop Backend

**Nom du projet** : EasyShop – Backend  
**Technologie principale** : Node.js + Express + MongoDB  
**But** : Créer une API REST sécurisée pour gérer un site e-commerce avec une interface admin.

---

### 🔐 Authentification

- Utilisation de `bcryptjs` pour hasher les mots de passe
- JWT généré à chaque connexion ou inscription
- Middleware `protect` pour protéger les routes privées
- Middleware `isAdmin` pour restreindre l'accès aux routes admin

---

### 🛒 Gestion des produits

- CRUD complet pour les produits
- Modèle `Product.js` avec titre, description, prix, stock, image, catégorie, etc.
- Fonction d’importation via `seeder.js` (admin + 20 produits de test)

---

### 🧍 Gestion des utilisateurs

- Inscription
- Connexion
- Vérification JWT sur chaque requête
- Champ `isAdmin` pour les droits avancés

---

### 🧱 Architecture du backend

- **Modèle MVC** : routes → contrôleurs → modèles
- Utilisation de `asyncHandler` pour les erreurs
- Séparation du middleware pour plus de lisibilité

---

### ⚙️ Configuration

- Utilisation de `dotenv` pour sécuriser les variables
- Connexion à MongoDB via `mongoose.connect(process.env.MONGO_URI)`
- Logger d’erreurs serveur propre

---

### 📂 Exécution et test

- Serveur lancé sur `localhost:5000`
- Testé via Postman :
  - `/api/products` → CRUD produit
  - `/api/users/login` → Authentification avec token JWT
  - `/api/users/register` → Inscription

---
🧑‍💻 Auteur
Mme NDIAYE – GomyCode Sénégal - Projet MERN
