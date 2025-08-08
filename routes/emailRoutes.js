const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/send-email", async (req, res) => {
  const { to, subject, cart, total, client } = req.body;
console.log("📤 Requête reçue, envoi vers :", to);

  if (!to || !subject || !cart || !total || !client) {
    return res.status(400).json({ message: "Données manquantes dans la requête." });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Connexion SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: true,
    debug: true,
  });

  // Vérifie que la connexion SMTP fonctionne
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ Erreur SMTP :", error);
    } else {
      console.log("✅ Serveur SMTP prêt :", success);
    }
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
      <h2 style="color: #4CAF50;">Merci pour votre commande, ${client.name} !</h2>
      <p>Voici les détails de votre commande :</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #4CAF50; color: white;">
            <th style="padding: 10px; border: 1px solid #ccc;">Produit</th>
            <th style="padding: 10px; border: 1px solid #ccc;">Quantité</th>
            <th style="padding: 10px; border: 1px solid #ccc;">Prix</th>
          </tr>
        </thead>
        <tbody>
          ${cart.map((item) => `
            <tr>
              <td style="padding: 10px; border: 1px solid #ccc;">${item.name}</td>
              <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">${item.quantity}</td>
              <td style="padding: 10px; border: 1px solid #ccc; text-align: right;">${item.price} FCFA</td>
            </tr>
          `).join("")}
        </tbody>
        <tfoot>
          <tr style="font-weight: bold;">
            <td colspan="2" style="text-align: right; padding: 10px;">Total</td>
            <td style="text-align: right; padding: 10px;">${total} FCFA</td>
          </tr>
        </tfoot>
      </table>
      ${client.address ? `<p style="margin-top: 20px;"><strong>Adresse de livraison :</strong> ${client.address}</p>` : ""}
      <p>À bientôt sur <strong>EasyShop</strong> !</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"EasyShop" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });

    res.status(200).json({ message: "✅ E-mail envoyé avec succès." });
  } catch (error) {
    console.error("❌ Erreur d'envoi :", error.message);
    res.status(500).json({ message: "❌ Échec de l'envoi du mail." });
  }
});

module.exports = router;
