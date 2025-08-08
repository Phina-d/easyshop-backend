const Product = require("../models/Product");

// ✅ Nouveau contrôleur : récupérer un produit par ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produit introuvable" });
    }
    res.json(product);
  } catch (error) {
    console.error("Erreur getProductById :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Sans pagination : pour /api/products/public
const getPublicProducts = async (req, res) => {
  try {
    const products = await Product.find({ isVisible: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Erreur getPublicProducts :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
// ✅ Avec pagination : pour /api/products (admin)
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments();
    const products = await Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Erreur getProducts :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Créer un produit
const createProduct = async (req, res) => {
  try {
    const { name, price, category, description, isVisible = true } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const product = new Product({ name, price, category, description, image,  isVisible, });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Erreur createProduct :", error);
    res.status(500).json({ message: "Erreur lors de la création du produit" });
  }
};


// ✅ Modifier un produit
const updateProduct = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updatedFields = { name, price, category, description };
    if (req.file) updatedFields.image = `/uploads/${req.file.filename}`;


    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    if (!product) return res.status(404).json({ message: "Produit non trouvé" });

    res.json(product);
  } catch (error) {
    console.error("Erreur updateProduct :", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour" });
  }
};


// ✅ Supprimer un produit
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Produit non trouvé" });

    res.json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    console.error("Erreur deleteProduct :", error);
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};
const makeAllVisible = async (req, res) => {
  try {
    await Product.updateMany({}, { $set: { isVisible: true } });
    res.send("Tous les produits sont maintenant visibles.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur mise à jour visibilité");
  }
};


// ✅ Export des fonctions
module.exports = {
  getProductById,
  getProducts, // ✅ pour admin
  getPublicProducts, // ✅ pour /public
  createProduct,
  updateProduct,
  deleteProduct,
   makeAllVisible,
};
