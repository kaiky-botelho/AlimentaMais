const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
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
        res.redirect('/login');
    }
}

function checkDoador(req, res, next) {
    if (req.session.userType === 'doador') {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Rota inicial
router.get('/', (req, res) => {
    res.render('landingPage');
});


router.get('/login', (req, res) => {
    res.render('login');
});

// Unificar o login em uma única rota
router.post('/login', async (req, res) => {
    const { email, senha, userType } = req.body;
    let table = '';
    let emailColumn = '';
    let senhaColumn = '';
    
    // Determinar a tabela e as colunas com base no tipo de usuário
    if (userType === 'beneficiario') {
        table = 'cadastro_beneficiario';
        emailColumn = 'benef_email';
        senhaColumn = 'benef_senha';
    } else if (userType === 'doador') {
        table = 'cadastro_doador';
        emailColumn = 'doador_email';
        senhaColumn = 'doador_senha';
    }

    try {
        // Query para buscar o usuário na tabela correta
        const query = `SELECT * FROM ${table} WHERE ${emailColumn} = $1`;
        const result = await pool.query(query, [email]);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            // Comparar a senha
            const isMatch = await bcrypt.compare(senha, user[senhaColumn]);

            if (isMatch) {
                req.session.userType = userType;  // Define o tipo de usuário
                req.session.userId = user.id_beneficiario || user.id_doador; // Armazena o ID na sessão
                const redirectPage = userType === 'beneficiario' ? '/beneficiarioHome' : '/doadorHome';
                return res.redirect(redirectPage);
            } else {
                return res.send(`
                    <script>
                        alert('Senha incorreta.');
                        window.location.href = '/login';
                    </script>
                `);
            }
        } else {
            return res.send(`
                <script>
                    alert('Usuário não encontrado.');
                    window.location.href = '/login';
                </script>
            `);
        }
    } catch (err) {
        console.error('Erro no login:', err);
        return res.send(`
            <script>
                alert('Erro ao realizar o login. Tente novamente.');
                window.location.href = '/login';
            </script>
        `);
    }
});

// Exportação
module.exports = router;
