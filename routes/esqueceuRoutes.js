const express = require('express');
const router = express.Router();
const { auth } = require('../config/firebase');  // Importando a configuração do Firebase
const { sendPasswordResetEmail } = require("firebase/auth");

// Rota POST para enviar o e-mail de redefinição de senha
router.post('/esqueceu', async (req, res) => {
  const { email } = req.body;  // Obtém o e-mail da requisição

  if (!email) {
    return res.status(400).json({ error: 'E-mail não fornecido' });
  }

  try {
    // Envia o e-mail de redefinição de senha
    await sendPasswordResetEmail(auth, email);
    res.status(200).json({ message: 'E-mail de redefinição de senha enviado com sucesso!' });
  } catch (error) {
    console.error("Erro ao enviar e-mail de redefinição:", error.message);
    res.status(500).json({ error: 'Erro ao enviar o e-mail de redefinição' });
  }
});

module.exports = router;
