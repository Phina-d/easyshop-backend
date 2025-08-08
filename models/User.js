const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// 📄 Définition du schéma utilisateur
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      enum: ["client", "closer", "chef", "admin"], // j'ai gardé "chef_service" (tu peux changer si besoin)
      default: "client",
    },
  },
  {
    timestamps: true, // ajoute createdAt et updatedAt automatiquement
  }
);

// 🔐 Hash du mot de passe avant sauvegarde
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔍 Méthode pour comparer le mot de passe en login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
