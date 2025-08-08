const Order = require("../models/Order");
const Product = require("../models/Product");
const nodemailer = require("nodemailer");
// ✅ Créer une commande
exports.createOrder = async (req, res) => {
  const { products } = req.body;

  if (!products || products.length === 0) {
    return res.status(400).json({ message: "Aucun produit dans la commande." });
  }

  try {
    console.log("🟡 Requête reçue dans createOrder:", req.body);
    console.log("🟢 Utilisateur connecté:", req.user);

    let total = 0;
    const detailedProducts = [];

    for (const item of products) {
      console.log("🧪 Produit reçu dans boucle:", item);
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Produit non trouvé: ${item.productId}` });
      }

      detailedProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      total += product.price * item.quantity;
    }

    const order = new Order({
      client: req.user._id,
      products: detailedProducts,
      total,
      status: "en attente", // doit correspondre au enum de ton modèle
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error("❌ Erreur détaillée:", err);
    res.status(500).json({
      message: "Erreur serveur lors de la création de la commande.",
      error: err.message,
    });
  }
};

// ✅ Lister toutes les commandes
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("client", "name email")
      .populate("products.product", "name price image");

    res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Erreur récupération commandes :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ✅ Récupérer une commande par ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("client", "name email")
      .populate("products.product", "name price image");

    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée." });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error("❌ Erreur récupération commande par ID :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ✅ Mettre à jour le statut
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée." });
    }

    order.status = status;
    await order.save();
    res.status(200).json(order);
  } catch (err) {
    console.error("❌ Erreur mise à jour statut commande :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ✅ Commandes à confirmer
exports.getOrdersToConfirm = async (req, res) => {
  try {
    const orders = await Order.find({ status: "en attente" }).populate("client", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération commandes", error: err.message });
  }
};

// ✅ Confirmer une commande
exports.confirmOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Commande non trouvée" });

    order.status = "confirmée";
    order.processedBy = req.user._id;
    await order.save();

    res.json({ message: "Commande confirmée", order });
  } catch (err) {
    res.status(500).json({ message: "Erreur confirmation commande", error: err.message });
  }
};

// ✅ Rejeter une commande
exports.rejectOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Commande non trouvée" });

    order.status = "rejetée";
    order.processedBy = req.user._id;
    await order.save();

    res.json({ message: "Commande rejetée", order });
  } catch (err) {
    res.status(500).json({ message: "Erreur rejet commande", error: err.message });
  }
};


// ✅ Liste des clients (commandes confirmées)
exports.getConfirmedClients = async (req, res) => {
  try {
    const orders = await Order.find({ status: "confirmée" }).populate("client", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération clients", error: err.message });
  }
};

// ✅ Liste des prospects (commandes rejetées)
exports.getProspectOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "rejetée" }).populate("client", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération prospects", error: err.message });
  }
};
// ✅ Liste des commandes par client connecté
exports.getOrdersByClient = async (req, res) => {
  try {
    const orders = await Order.find({ client: req.user._id })
      .populate("products.product", "name price image");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération de vos commandes", error: err.message });
  }
};
// ✅ Liste toutes les commandes (admin ou closer)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("client", "name email")
      .populate("products.product", "name price");

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
// ✅ Envoyer un email au client (ex: après confirmation)

exports.sendOrderEmail = async (req, res) => {
  const { to, subject, cart, total, client } = req.body;

  if (!to || !subject || !cart || !total || !client) {
    return res.status(400).json({ message: "Données manquantes." });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlContent = `
    <h2>Bonjour ${client.name},</h2>
    <p>Merci pour votre commande. Voici les détails :</p>
    <ul>
      ${cart.map(p => `<li>${p.name} x${p.quantity} - ${p.price} FCFA</li>`).join("")}
    </ul>
    <p><strong>Total : ${total} FCFA</strong></p>
  `;

  try {
    await transporter.sendMail({
      from: `"EasyShop" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });

    res.status(200).json({ message: "Mail envoyé avec succès." });
  } catch (err) {
    console.error("Erreur envoi email :", err);
    res.status(500).json({ message: "Erreur envoi email", error: err.message });
  }
};
// ✅ Mettre à jour processedBy (traitée par un closer)
exports.updateOrderProcessedBy = async (req, res) => {
  try {
    const { processedBy } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée." });
    }

    order.processedBy = processedBy;  // ou req.user._id si tu veux forcer à l'user connecté
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
