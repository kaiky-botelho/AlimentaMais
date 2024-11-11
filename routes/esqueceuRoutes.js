const express = require('express');
const router = express.Router();
const { auth } = require('./firebase'); // Importa a instância de autenticação configurada
const { sendPasswordResetEmail } = require("firebase/auth");

// Rota para solicitar a redefinição de senha
router.post('/esqueceu', async (req, res) => {
    const { email } = req.body;

    try {
        // Usa o Firebase Auth para enviar o e-mail de redefinição
        await sendPasswordResetEmail(auth, email);
        console.log('E-mail de redefinição enviado para:', email);
        res.status(200).send('E-mail de redefinição enviado com sucesso');
    } catch (error) {
        console.error('Erro ao enviar e-mail de redefinição:', error);
        if (error.code === 'auth/user-not-found') {
            res.status(400).send('Usuário não encontrado');
        } else {
            res.status(500).send('Erro ao enviar e-mail de redefinição');
        }
    }
});

module.exports = router;
