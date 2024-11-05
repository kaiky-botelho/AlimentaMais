const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// Rota para exibir o formulário de recuperação de senha
router.get('/esqueceu', (req, res) => {
    res.render('esqueceu'); // Renderiza a página sem a variável message
});

// Rota para processar o envio do formulário 
router.post('/esqueceu', (req, res) => {
    const { email } = req.body;

    // Aqui você pode adicionar a lógica para enviar o e-mail de recuperação

    // Após processar o envio, redirecione de volta para o formulário (ou outra ação)
    res.redirect('/esqueceu'); // Redireciona de volta para o formulário
});

module.exports = router;
