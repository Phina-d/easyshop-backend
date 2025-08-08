const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ✅ Fonction pour générer un token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// ✅ Enregistrement
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email déjà utilisé" });

    const user = await User.create({ name, email, password, role: role || "client" });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (err) {
    console.error("Erreur dans registerUser:", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Connexion
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });

  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Profil utilisateur connecté
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Liste des clients
exports.getClients = async (req, res) => {
  try {
    const clients = await User.find({ role: "client" }).select("-password");
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Tous les utilisateurs (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query; // récupère ?role=...
    const filter = role ? { role } : {}; // filtre si role fourni

    const users = await User.find(filter).select("-password");

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer un utilisateur par ID (admin uniquement)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    console.error("Erreur getUserById:", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Modifier un utilisateur (admin uniquement)
exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;

    // On récupère d'abord l'utilisateur complet
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // On met à jour les champs simples (nom, email, role, etc.)
    Object.keys(updates).forEach((key) => {
      if (key !== "password") {
        user[key] = updates[key];
      }
    });

    // Si le mot de passe est présent dans la requête, on met à jour aussi
    if (updates.password) {
      user.password = updates.password; // Le hashage se fait via le middleware pre('save') dans User.js
    }

    // On sauvegarde l'utilisateur, ce qui déclenche le hash du password s'il a changé
    await user.save();

    // On renvoie l'utilisateur sans le password
    const userSafe = user.toObject();
    delete userSafe.password;

    res.json(userSafe);
  } catch (err) {
    console.error("Erreur updateUser:", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ✅ Modifier le rôle d’un utilisateur
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    user.role = role;
    await user.save();
    res.json({ message: "Rôle mis à jour", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
