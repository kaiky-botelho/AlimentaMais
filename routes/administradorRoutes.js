const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { format } = require('date-fns');
const { ptBR } = require('date-fns/locale');
const pool = require('../config/database');


router.get('/admimHome', (req, res) => {
    res.render('admimHome');
});

router.get('/cadAdmin', (req, res) => {
    res.render('cadAdmin');
});


router.post('/cadastroAdmin', async (req, res) => {
    const { 
        email, 
        senha
    } = req.body;

    try {
        // Verifique se a senha foi fornecida
        if (!senha || senha.trim() === '') {
            return res.send(`<script>alert('Senha não fornecida.'); window.location.href = '/beneficiario';</script>`);
        }

        // Hash da senha
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(senha, saltRounds);

        const query = `
            INSERT INTO administrador 
            (email, senha) 
            VALUES ($1, $2) 
            RETURNING id
        `;

        const values = [
            email, 
            hashedPassword
        ];

        const result = await pool.query(query, values);
        
        res.send(`<script>alert('Beneficiário cadastrado com sucesso! ID: ${result.rows[0].id_beneficiario}'); window.location.href = '/login';</script>`);
    } catch (error) {
        console.error('Erro ao cadastrar beneficiário:', error);
        res.send(`<script>alert('Erro ao cadastrar beneficiário. Tente novamente.'); window.location.href = '/cadAmin';</script>`);
    }
});

module.exports = router;