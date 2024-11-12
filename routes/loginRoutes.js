const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { Pool } = require('pg');
const pool = require('../config/database');

router.use(bodyParser.urlencoded({ extended: true }));

// Configuração da sessão
router.use(session({
    secret: 'seu-segredo-de-sessao', // Substitua por um segredo forte
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Se estiver em produção, defina como true e use HTTPS
}));

// Middleware para verificar autenticação e tipo de usuário
function verificarAutenticacao(tipoUsuario) {
    return (req, res, next) => {
        if (req.session.user && req.session.user.tipo_usuario === tipoUsuario) {
            next();
        } else {
            res.redirect('/');
        }
    };
}

// Rota inicial
router.get('/', (req, res) => {
    res.render('inicial');
});

// Rota de login para doadores
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
                // Define a sessão com tipo de usuário doador
                req.session.user = { id: doador.id, tipo_usuario: 'doador' };
                res.redirect('/doadorHome');
            } else {
                res.render('loginDoador', { errorMessage: 'Senha incorreta.' });
            }
        } else {
            res.render('loginDoador', { errorMessage: 'Usuário não encontrado.' });
        }
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).send('Erro ao realizar o login');
    }
});

// Rota de login para beneficiários
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
                req.session.user = { id: benef.id, tipo_usuario: 'beneficiario' };
                res.redirect('/beneficiarioHome');
            } else {
                res.render('loginBenef', { errorMessage: 'Senha incorreta.' });
            }
        } else {
            res.render('loginBenef', { errorMessage: 'Usuário não encontrado.' });
        }
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).send('Erro ao realizar o login');
    }
});

// Rota protegida para doadores
router.get('/doadorHome', verificarAutenticacao('doador'), (req, res) => {
    res.render('doadorHome');
});

// Rota protegida para beneficiários
router.get('/beneficiarioHome', verificarAutenticacao('beneficiario'), (req, res) => {
    res.render('beneficiarioHome');
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao sair:', err);
            res.status(500).send('Erro ao sair');
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;
