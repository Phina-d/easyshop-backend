const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendTestEmail() {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Test EasyShop" <${process.env.EMAIL_USER}>`,
      to: "phinadiouf@gmail.com", // <-- mets ton propre e-mail ici
      subject: "✅ Test Envoi Mail EasyShop",
      text: "Ceci est un test depuis EasyShop en local.",
    });

    console.log("✅ Mail de test envoyé !");
  } catch (error) {
    console.error("❌ Erreur d'envoi :", error.message);
  }
}

sendTestEmail();
