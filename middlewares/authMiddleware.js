// middlewares/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Utilisateur non trouvé" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Token invalide" });
    }
  } else {
    return res.status(401).json({ message: "Non autorisé, token manquant" });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log("Role utilisateur:", req.user.role);
    console.log("Rôles autorisés:", roles);
    if (!roles.includes(req.user.role)) {
      console.log("Accès refusé pour ce rôle");
      return res.status(403).json({ message: "Accès refusé : rôle insuffisant" });
    }
    console.log("Accès accordé");
    next();
  };
};
