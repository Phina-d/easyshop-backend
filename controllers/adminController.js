const User = require("../models/User");
const Order = require("../models/Order");

exports.getDashboardStats = async (req, res) => {
  try {
    // Total utilisateurs
    const totalUsers = await User.countDocuments();

    // Commandes à confirmer (en attente)
    const ordersToConfirm = await Order.countDocuments({ status: "en attente" });

    // Commandes confirmées
    const confirmedOrders = await Order.countDocuments({ status: "confirmée" });

    // Total des revenus (commandes confirmées uniquement)
    const confirmed = await Order.find({ status: "confirmée" });
    const totalRevenue = confirmed.reduce((sum, order) => sum + (order.total || 0), 0);

    // Réponse JSON
    res.status(200).json({
      totalUsers,
      ordersToConfirm,
      confirmedOrders,
      totalRevenue,
    });
  } catch (err) {
    console.error("Erreur dans getDashboardStats:", err);
    res.status(500).json({
      message: "Erreur lors de la récupération des statistiques",
      error: err.message,
    });
  }
};
