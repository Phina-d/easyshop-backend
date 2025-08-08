const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    image: String,
    isVisible: { type: Boolean, default: true }, // ✅ Ajout ici
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
