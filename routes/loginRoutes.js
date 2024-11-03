const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Para a comparação de senhas
const { Pool } = require('pg'); // Para conexão com PostgreSQL

router.use(bodyParser.urlencoded({ extended: true }));

// Rota para a página de login
router.get('/', (req, res) => {
    res.render('login');  
});

// Rota para processar o login
router.post('/login', async (req, res) => {
    const { documento, senha } = req.body;

    // Verificar se o usuário é um doador
    const doadorResult = await pool.query('SELECT * FROM cadastro_doador WHERE doador_documento = $1', [documento]);
    const doador = doadorResult.rows[0];

    if (doador && await bcrypt.compare(senha, doador.doador_senha)) {
        req.session.userId = doador.id_doador;
        req.session.role = 'doador';
        return res.redirect('/home-doador'); // Redireciona para a home do doador
    }

    // Verificar se o usuário é um beneficiário
    const beneficiarioResult = await pool.query('SELECT * FROM cadastro_beneficiario WHERE benef_documento = $1', [documento]);
    const beneficiario = beneficiarioResult.rows[0];

    if (beneficiario && await bcrypt.compare(senha, beneficiario.benef_senha)) {
        req.session.userId = beneficiario.id_beneficiario;
        req.session.role = 'beneficiario';
        return res.redirect('/home-beneficiario'); // Redireciona para a home do beneficiário
    }

    // Se não for encontrado, retorna erro
    res.status(401).send('Usuário ou senha inválidos.');
});

// Exports da rota
module.exports = router;

  module.exports = router;