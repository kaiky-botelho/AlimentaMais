const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../config/database');

// Rota para exibir o formulário de cadastro de beneficiário
router.get('/beneficiario', (req, res) => {
    res.render('beneficiario');
});

// Rota para processar o formulário de cadastro de beneficiários
router.post('/cadastroBeneficiario', async (req, res) => {
    const { 
        nome, 
        benef_documento, 
        benef_telefone, 
        benef_data_nasc, 
        benef_email, 
        benef_senha, 
        benef_cep, 
        benef_cidade, 
        benef_UF, 
        benef_endereco, 
        benef_numero, 
        benef_bairro, 
        benef_complemento, 
        renda 
    } = req.body;

    try {
        // Hash da senha
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(benef_senha, saltRounds);

        const query = `
            INSERT INTO cadastro_beneficiario 
            (nome, benef_documento, benef_telefone, benef_data_nasc, benef_email, benef_senha, benef_cep, benef_cidade, benef_UF, benef_endereco, benef_numero, benef_bairro, benef_complemento, renda) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
            RETURNING id_beneficiario
        `;

        const values = [
            nome, 
            benef_documento, 
            benef_telefone, 
            benef_data_nasc, 
            benef_email, 
            hashedPassword, 
            benef_cep, 
            benef_cidade, 
            benef_UF, 
            benef_endereco, 
            benef_numero, 
            benef_bairro, 
            benef_complemento, 
            renda
        ];

        const result = await pool.query(query, values);
        
        res.send(`<script>alert('Beneficiário cadastrado com sucesso! ID: ${result.rows[0].id_beneficiario}'); window.location.href = '/beneficiario';</script>`);
    } catch (error) {
        console.error('Erro ao cadastrar beneficiário:', error);
        res.send(`<script>alert('Erro ao cadastrar beneficiário. Tente novamente.'); window.location.href = '/beneficiario';</script>`);
    }
});

// Rota para a página principal do beneficiário
router.get('/beneficiarioHome', async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/loginBeneficiario');
    }

    try {
        const query = 'SELECT nome, benef_email, benef_endereco, benef_bairro, benef_cidade, benef_UF, benef_cep FROM cadastro_beneficiario WHERE id_beneficiario = $1';
        const result = await pool.query(query, [userId]);

        if (result.rows.length > 0) {
            const beneficiario = result.rows[0];

            res.render('beneficiarioHome', {
                nome: beneficiario.nome,
                benef_email: beneficiario.benef_email,
                benef_endereco: beneficiario.benef_endereco,
                benef_bairro: beneficiario.benef_bairro,
                benef_cidade: beneficiario.benef_cidade,
                benef_UF: beneficiario.benef_UF,
                benef_cep: beneficiario.benef_cep
            });
        } else {
            res.send('Usuário não encontrado');
        }
    } catch (error) {
        console.error('Erro ao consultar o banco de dados:', error);
        res.send('Erro ao buscar informações do usuário');
    }
});

// Rota para solicitar doações
router.get('/solicitar', async (req, res) => {
    try {
        const doacaoResult = await pool.query('SELECT id_doacao, doacao_alimento, doacao_qtd FROM doacao');
        const doacoes = doacaoResult.rows || [];

        const doadorResult = await pool.query('SELECT id_doador, doador_endereco FROM cadastro_doador');
        const doadores = doadorResult.rows || [];

        res.render('solicitar', { doacoes, doadores });
    } catch (error) {
        console.error('Erro ao consultar o banco de dados:', error);
        res.status(500).send('Erro ao carregar doações');
    }
});

// Rota para processar a solicitação
router.post('/fazerSolicitacao', async (req, res) => {
    const { solicitacao_alimento, solicitacao_qtd, solicitacao_obs, solicitacao_entrega, solicitacao_data, solicitacao_horario } = req.body;

    if (!['Entregar pessoalmente', 'Retirar no endereço'].includes(solicitacao_entrega)) {
        return res.send(`<script>alert('Valor inválido para entrega. Selecione entre "Entregar pessoalmente" ou "Retirar no endereço".'); window.location.href = '/solicitar';</script>`);
    }

    try {
        const query = `
            INSERT INTO solicitacao (solicitacao_alimento, solicitacao_qtd, solicitacao_obs, solicitacao_entrega, solicitacao_data, solicitacao_horario)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_solicitacao
        `;
        const values = [solicitacao_alimento, solicitacao_qtd, solicitacao_obs, solicitacao_entrega, solicitacao_data, solicitacao_horario];
        const result = await pool.query(query, values);

        const deleteQuery = `
            DELETE FROM doacao
            WHERE id_doacao = (
                SELECT id_doacao
                FROM doacao
                WHERE doacao_alimento = $1
                AND doacao_qtd >= $2
                LIMIT 1
            )
        `;
        const deleteValues = [solicitacao_alimento, solicitacao_qtd];
        await pool.query(deleteQuery, deleteValues);

        res.send(`<script>alert('Solicitação cadastrada com sucesso! ID: ${result.rows[0].id_solicitacao}'); window.location.href = '/solicitar';</script>`);
    } catch (error) {
        console.error('Erro ao cadastrar a solicitação:', error);
        res.status(500).send(`<script>alert('Erro ao cadastrar a solicitação. Tente novamente.'); window.location.href = '/solicitar';</script>`);
    }
});

module.exports = router;