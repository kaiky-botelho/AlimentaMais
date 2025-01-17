const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../config/database');

// Exibição da página inicial do administrador
router.get('/admimHome', (req, res) => {
    res.render('admimHome');
});

// Exibição da página de cadastro de administrador
router.get('/cadAdmin', (req, res) => {
    res.render('cadAdmin');
});

// Cadastro de administrador
router.post('/cadastroAdmin', async (req, res) => {
    const { email, senha } = req.body;

    try {
        if (!senha || senha.trim() === '') {
            return res.send(`<script>alert('Senha não fornecida.'); window.location.href = '/cadAdmin';</script>`);
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(senha, saltRounds);

        const query = `
            INSERT INTO administrador (email, senha) 
            VALUES ($1, $2) 
            RETURNING id
        `;

        const values = [email, hashedPassword];
        const result = await pool.query(query, values);

        res.send(`<script>alert('Administrador cadastrado com sucesso!'); window.location.href = '/login';</script>`);
    } catch (error) {
        console.error('Erro ao cadastrar administrador:', error);
        res.send(`<script>alert('Erro ao cadastrar administrador. Tente novamente.'); window.location.href = '/cadAdmin';</script>`);
    }
});

// Buscar todos os beneficiários para aprovação
router.get('/beneficiarios', async (req, res) => {
    try {
        const query = `
            SELECT id_beneficiario, nome, benef_documento
            FROM cadastro_beneficiario
        `;

        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar beneficiários:', error);
        res.status(500).json({ error: 'Erro ao buscar beneficiários.' });
    }
});

// Ver o cadastro completo do benef
router.get('/beneficiarios/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT id_beneficiario, nome, benef_documento, benef_telefone, 
                   benef_data_nasc, benef_email, benef_cep, benef_cidade, 
                   benef_UF, benef_endereco, benef_numero, benef_bairro, 
                   benef_complemento, qtd_familiares, renda, comprovantepdf 
            FROM cadastro_beneficiario
            WHERE id_beneficiario = $1
        `;

        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Beneficiário não encontrado.' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar detalhes do beneficiário:', error);
        res.status(500).json({ error: 'Erro ao buscar detalhes do beneficiário.' });
    }
});


// Aprovar beneficiário
router.put('/beneficiarios/:id/aprovar', async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            UPDATE cadastro_beneficiario 
            SET aprovado = TRUE 
            WHERE id_beneficiario = $1
        `;

        await pool.query(query, [id]);
        res.json({ message: 'Beneficiário aprovado com sucesso.' });
    } catch (error) {
        console.error('Erro ao aprovar beneficiário:', error);
        res.status(500).json({ error: 'Erro ao aprovar beneficiário.' });
    }
});

// Excluir beneficiário
router.delete('/beneficiarios/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Excluir o beneficiário do banco de dados
        const query = `
            DELETE FROM cadastro_beneficiario 
            WHERE id_beneficiario = $1
        `;

        await pool.query(query, [id]);
        res.json({ message: 'Beneficiário excluído com sucesso.' });
    } catch (error) {
        console.error('Erro ao excluir beneficiário:', error);
        res.status(500).json({ error: 'Erro ao excluir beneficiário.' });
    }
});

module.exports = router;
