const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session'); // Para gerenciamento de sessão
const { Pool } = require('pg');
const pool = require('../config/database');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

// Middleware para proteger rotas
function checkBeneficiario(req, res, next) {
    if (req.session.userType === 'beneficiario') {
        return next();
    } else {
        res.redirect('/loginBenef');
    }
}

function checkDoador(req, res, next) {
    if (req.session.userType === 'doador') {
        return next();
    } else {
        res.redirect('/loginDoador');
    }
}

// Rota inicial
router.get('/', (req, res) => {
    res.render('inicial');
});

// Login Beneficiário
router.get('/loginBenef', (req, res) => {
    res.render('loginBenef');
});

router.post('/loginBenef', async (req, res) => {
    const { benef_email, benef_senha } = req.body;

    try {
        const query = 'SELECT * FROM cadastro_beneficiario WHERE benef_email = $1';
        const result = await pool.query(query, [benef_email]);

        if (result.rows.length > 0) {
            const benef = result.rows[0];
            const isMatch = await bcrypt.compare(benef_senha, benef.benef_senha);

            if (isMatch) {
                req.session.userType = 'beneficiario';
                res.redirect('/beneficiarioHome');
            } else {
                res.render('loginBenef', { errorMessage: 'Senha incorreta' });
            }
        } else {
            res.render('loginBenef', { errorMessage: 'Usuário não encontrado' });
        }
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).send('Erro ao realizar o login');
    }
});

// Login Doador
router.get('/loginDoador', (req, res) => {
    res.render('loginDoador');
});

router.post('/loginDoador', async (req, res) => {
    const { doador_email, doador_senha } = req.body;

    try {
        const query = 'SELECT * FROM cadastro_doador WHERE doador_email = $1';
        const result = await pool.query(query, [doador_email]);

        if (result.rows.length > 0) {
            const doador = result.rows[0];
            const isMatch = await bcrypt.compare(doador_senha, doador.doador_senha);

            if (isMatch) {
                req.session.userType = 'doador';
                res.redirect('/doadorHome');
            } else {
                res.render('loginDoador', { errorMessage: 'Senha incorreta' });
            }
        } else {
            res.render('loginDoador', { errorMessage: 'Usuário não encontrado' });
        }
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).send('Erro ao realizar o login');
    }
});

// Páginas principais protegidas
router.get('/beneficiarioHome', checkBeneficiario, (req, res) => {
    res.render('beneficiarioHome');
});

router.get('/doadorHome', checkDoador, (req, res) => {
    res.render('doadorHome');
});

// Corrigido a exportação
module.exports = router;
