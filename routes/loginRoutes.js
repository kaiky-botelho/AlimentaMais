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
                // Armazenar o ID do usuário na sessão
                req.session.userId = doador.id_doador;

                // Redireciona para a página principal do doador
                res.redirect('/doadorHome');
            } else {
                // Passa a mensagem de erro para a view caso a senha esteja incorreta
                res.render('loginDoador', { errorMessage: 'Credenciais incorretas.' });
            }
        } else {
            // Passa a mensagem de erro para a view caso o usuário não seja encontrado
            res.render('loginDoador', { errorMessage: 'Credenciais incorretas.' });
        }
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).send('Erro ao realizar o login');
    }
});


// Página inicial após login
router.get('/doadorHome', async (req, res) => {
    // Verificar se o ID do usuário está na sessão
    if (!req.session.userId) {
        return res.redirect('/loginDoador');  // Redireciona para a página de login se não estiver autenticado
    }

    const userId = req.session.userId;

    try {
        const query = 'SELECT nome_razao FROM cadastro_doador WHERE id_doador = $1';
        const result = await pool.query(query, [userId]);

        if (result.rows.length > 0) {
            const nomeUsuario = result.rows[0].nome_razao;
            res.render('doadorHome', { nome: nomeUsuario });
        } else {
            res.status(404).send('Usuário não encontrado');
        }
    } catch (error) {
        console.error('Erro ao consultar o banco de dados:', error);
        res.status(500).send('Erro ao buscar informações do usuário');
    }
});


module.exports = router;