const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json({ limit: "50mb" })); // Para suportar grandes imagens em base64

// Rota para enviar o e-mail com a captura de tela
app.post("/send-email", (req, res) => {
  const { image } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "eusoolacta@gmail.com",
      pass: "a4c4m4b4",
    },
  });

  const mailOptions = {
    from: "eusoolacta@gmail.com",
    to: "dougpeltier92@gmail.com",
    subject: "Formulário - Captura de Tela",
    html: "<p>Veja a captura de tela anexada.</p>",
    attachments: [
      {
        filename: "screenshot.png",
        content: image.split("base64,")[1],
        encoding: "base64",
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erro ao enviar e-mail:", error);
      res.json({ success: false });
    } else {
      console.log("Email enviado:", info.response);
      res.json({ success: true });
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
