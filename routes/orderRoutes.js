const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const orderController = require("../controllers/orderController");

const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  confirmOrder,
  rejectOrder,
  getConfirmedClients,
  getProspectOrders,
  getOrdersToConfirm,
  getOrdersByClient,
  getAllOrders,
  sendOrderEmail,
  updateOrderProcessedBy,  // <-- ajoute cette fonction ici si tu veux la destructurer
} = require("../controllers/orderController");

const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

// Routes existantes...
router.patch("/confirm/:id", protect, authorizeRoles("closer", "admin"), confirmOrder);
router.delete("/delete/:id", protect, authorizeRoles("closer", "admin"), rejectOrder);
router.get("/to-confirm", protect, authorizeRoles("admin", "closer"), getOrdersToConfirm);
router.get("/my-orders", protect, getOrdersByClient);
router.get("/clients", protect, authorizeRoles("admin", "closer", "chef"), getConfirmedClients);
router.get("/prospects", protect, authorizeRoles("admin", "closer", "chef"), getProspectOrders);
router.get("/", protect, authorizeRoles("admin", "closer"), getAllOrders);
router.post("/", protect, createOrder);
router.put("/:id/status", protect, authorizeRoles("admin", "closer"), updateOrderStatus);
router.post("/:id/send-email", protect, authorizeRoles("admin", "closer"), sendOrderEmail);

// Routes Closers spécifiques
router.get("/processed-by-me", protect, authorizeRoles("closer"), async (req, res) => {
  try {
    const orders = await Order.find({ processedBy: req.user._id }).populate("client", "name");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.get(
  "/orders/closer",
  protect,
  authorizeRoles("closer"),
  async (req, res) => {
    try {
      const orders = await Order.find({ processedBy: req.user._id }).populate("client");
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors du chargement des commandes" });
    }
  }
);

router.put(
  "/orders/:id/note",
  protect,
  authorizeRoles("closer"),
  async (req, res) => {
    const { note } = req.body;
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: "Commande introuvable" });

      if (String(order.processedBy) !== req.user._id.toString()) {
        return res.status(403).json({ message: "Non autorisé" });
      }

      order.note = note;
      await order.save();
      res.json({ message: "Note enregistrée" });
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la mise à jour de la note" });
    }
  }
);

// ** UNE SEULE route PUT /:id pour updateOrderProcessedBy **
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "closer"),  // ajoute l'authorization si nécessaire
  updateOrderProcessedBy
);

// Détails commande par ID (à mettre en dernier)
router.get("/:id", protect, authorizeRoles("admin", "closer"), getOrderById);

module.exports = router;
