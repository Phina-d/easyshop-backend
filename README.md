🛒 EasyShop - API back-end (pile MERN) Ce projet constitue le backend de l'application e-commerce EasyShop , développé avec Node.js , Express , MongoDB et JWT .

✅ Fonctionnalités principales

🔐 Authentification utilisateur avec JWT (admin/client) 📦 Gestion des produits (CRUD) 🛒 Création de commandes (commande + confirmation par email) 📧 Envoi automatique de facture par email via Nodemailer 👥 Gestion des utilisateurs (rôles admin/client) 📁 Upload d'images produits 🔒 Middleware de protection des routes 🌍 Compatible avec un frontend React (Netlify)

✅ Fonctionnalités principales

🔐 Authentification utilisateur avec JWT (admin/client) 📦 Gestion des produits (CRUD) 🛒 Création de commandes (commande + confirmation par email) 📧 Envoi automatique de facture par email via Nodemailer 👥 Gestion des utilisateurs (rôles admin/client) 📁 Upload d'images produits 🔒 Middleware de protection des routes 🌍 Compatible avec un frontend React (Netlify)

Architecture MVC claire
🛠️ Technologies utilisées Node.js Express.js MongoDB + Mongoose Nodemailer dotenv CORS Multer (pour les fichiers) JSON Web Tokens (JWT) bcryptjs
🔧 Installation
Cloner le dépôt :
git clone https://github.com/votre-utilisateur/easyshop-backend.git
cd easyshop-backend
Installer les dépendances :


npm install
Configurer les variables d'environnement dans un fichier .env :


🔐 Variables d’environnement .env
Crée un fichier .env à la racine du dossier server/ :

PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/easyshop
EMAIL_USER=tonemail@gmail.com
EMAIL_PASS=motdepasse_application_gmail
JWT_SECRET=une_clé_secrète
Lancer le serveur en développement :


npm run dev
🚀 Seeder des données
Pour insérer un admin par défaut et des produits de démonstration :
node seeder.js

📄 Routes disponibles (API)
Méthode	URL	Fonction
POST	/api/auth/register	Enregistrement d’un utilisateur
POST	/api/auth/login	Connexion et retour du JWT
GET	/api/products	Liste de tous les produits
POST	/api/products	Ajouter un produit (admin)
POST	/api/orders	Créer une commande
POST	/api/email/send-email	Envoyer la facture par email
GET	/api/users	Liste des utilisateurs (admin)

🗂️ Structure des dossiers

easyshop-backend/
│
├── config/
│   └── db.js                # Connexion MongoDB
├── controllers/
│   ├── productController.js
│   └── userController.js
│
├── middleware/
│   └── authMiddleware.js
    └── uploadMiddleware.js
│
├── models/
│   ├── Product.js
│   └── User.js
    └── Order.js
│
├── routes/
│   └── adminProducts.js
│   └── adminRoutes.js
│   └── authRoutes.js
│   └── emailRoutes.js
│   └── orderRoutes.js
│   └── productRoutes.js
│   └── userRoutes.js
│    
│
├── uploads/                # Images uploadées
├── seeder.js             # Seed initial (admin + produits)
├── server.js             # Point d’entrée
└── .env                  # Variables d’environnement (non commit)
└── multer-config.js
└── package.json

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
- Authentification par JWT généré à chaque connexion ou inscription
- Middleware `protect` pour protéger les routes privées
- Middleware `isAdmin` pour restreindre l'accès aux routes admin
- Middleware pour vérifier le rôle admin ou client
- CORS activé pour le frontend React
- Protection contre l'accès non autorisé à certaines routes

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
Mme NDIAYE – GomyCode Sénégal - Projet MERN Backend