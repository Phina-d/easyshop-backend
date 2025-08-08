const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

// Dossier de stockage
const UPLOADS_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// Configuration de multer en mémoire
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Type de fichier non autorisé"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Middleware de traitement avec sharp
const processImage = async (req, res, next) => {
  if (!req.file) return next();

  const filename = `${Date.now()}.webp`;
  const filePath = path.join(UPLOADS_DIR, filename);

  try {
    await sharp(req.file.buffer)
      .resize({ width: 600 }) // redimensionner à 600px de large
      .webp({ quality: 80 }) // convertir en WebP compressé
      .toFile(filePath);

    // Remplace le champ file par un champ filename
    req.file.filename = filename;
    next();
  } catch (err) {
    console.error("Erreur lors du traitement de l’image :", err);
    res.status(500).json({ message: "Erreur lors du traitement de l’image" });
  }
};

module.exports = {
  upload,
  processImage,
};
