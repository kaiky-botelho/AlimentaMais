const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Para a comparação de senhas
const { Pool } = require('pg'); // Para conexão com PostgreSQL
const pool = require('../config/database'); // Importando a conexão com o 


router.use(bodyParser.urlencoded({ extended: true }));

// Rota para a páginas de logins e inicial
router.get('/', (req, res) => {
    res.render('inicial');  
});

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
            const isMatch = await bcrypt.compare(doador_senha, benef.benef_senha);

            if (isMatch) {
                // Redireciona para a página principal do doador
                res.redirect('/beneficiarioHome');
            } else {
                // Passa a mensagem de erro para a view caso a senha esteja incorreta
                res.render('loginBenef', { errorMessage: 'Senha incorreta.' });
            }
        } else {
            // Passa a mensagem de erro para a view caso o usuário não seja encontrado
            res.render('loginBenef', { errorMessage: 'Usuário não encontrado.' });
        }
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).send('Erro ao realizar o login');
    }
});


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
                // Redireciona para a página principal do doador
                res.redirect('/doadorHome');
            } else {
                // Passa a mensagem de erro para a view caso a senha esteja incorreta
                res.render('loginDoador', { errorMessage: 'Senha incorreta.' });
            }
        } else {
            // Passa a mensagem de erro para a view caso o usuário não seja encontrado
            res.render('loginDoador', { errorMessage: 'Usuário não encontrado.' });
        }
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).send('Erro ao realizar o login');
    }
});

// Página inicial após login
router.get('/doadorHome', (req, res) => { 
    res.render('doadorHome');  
});

module.exports = router;
