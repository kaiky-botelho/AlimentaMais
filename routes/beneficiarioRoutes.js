const express = require('express');
const bcrypt = require('bcrypt');
const { format } = require('date-fns');
const { ptBR } = require('date-fns/locale');
const pool = require('../config/database');

const router = express.Router();

// Middleware para verificar autenticação do beneficiário
const verificarAutenticacao = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/loginBenef');
    }
    next();
};

// Utilitários
const formataData = (data) => (data ? format(new Date(data), 'dd/MM/yyyy', { locale: ptBR }) : '');
const hashSenha = async (senha) => await bcrypt.hash(senha, 10);

// Rota: Exibir formulário de cadastro de beneficiário
router.get('/beneficiario', (req, res) => res.render('beneficiario'));

// Rota: Processar cadastro de beneficiário
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
        const hashedPassword = await hashSenha(benef_senha);

        const query = `
            INSERT INTO cadastro_beneficiario 
            (nome, benef_documento, benef_telefone, benef_data_nasc, benef_email, benef_senha, benef_cep, benef_cidade, benef_UF, benef_endereco, benef_numero, benef_bairro, benef_complemento, renda) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
            RETURNING id_beneficiario
        `;
        const values = [
            nome, benef_documento, benef_telefone, benef_data_nasc, benef_email, hashedPassword, benef_cep, benef_cidade,
            benef_UF, benef_endereco, benef_numero, benef_bairro, benef_complemento, renda
        ];

        const result = await pool.query(query, values);

        res.send(`<script>alert('Beneficiário cadastrado com sucesso! ID: ${result.rows[0].id_beneficiario}'); window.location.href = '/beneficiario';</script>`);
    } catch (error) {
        console.error('Erro ao cadastrar beneficiário:', error);
        res.send(`<script>alert('Erro ao cadastrar beneficiário. Tente novamente.'); window.location.href = '/beneficiario';</script>`);
    }
});

// Rota: Página inicial do beneficiário
router.get('/beneficiarioHome', verificarAutenticacao, async (req, res) => {
    const userId = req.session.userId;

    try {
        // Consultar dados do beneficiário
        const beneficiarioQuery = `
            SELECT nome, benef_email, benef_endereco, benef_bairro, benef_cidade, benef_UF, benef_cep 
            FROM cadastro_beneficiario 
            WHERE id_beneficiario = $1
        `;
        const beneficiarioResult = await pool.query(beneficiarioQuery, [userId]);

        if (beneficiarioResult.rows.length === 0) {
            return res.send('Usuário não encontrado');
        }

        const beneficiario = beneficiarioResult.rows[0];

        // Consultar solicitações do beneficiário
        const solicitacaoQuery = `
            SELECT solicitacao_alimento, solicitacao_qtd, solicitacao_obs, endereco_retirada, solicitacao_data, solicitacao_horario 
            FROM solicitacao 
            WHERE id_beneficiario = $1
        `;
        const solicitacaoResult = await pool.query(solicitacaoQuery, [userId]);

        const solicitacoes = solicitacaoResult.rows.map((solicitacao) => ({
            ...solicitacao,
            solicitacao_data: formataData(solicitacao.solicitacao_data),
        }));

        // Renderizar página inicial do beneficiário
        res.render('beneficiarioHome', { ...beneficiario, solicitacoes });
    } catch (error) {
        console.error('Erro ao consultar o banco de dados:', error);
        res.send('Erro ao buscar informações do usuário');
    }
});

// Rota: Exibir formulário de solicitação
router.get('/solicitar', verificarAutenticacao, async (req, res) => {
    const userId = req.session.userId;

    try {
        const solicitadosQuery = `SELECT id_doacao FROM solicitacao WHERE id_beneficiario = $1`;
        const solicitadosResult = await pool.query(solicitadosQuery, [userId]);

        const doacoesSolicitadasIds = solicitadosResult.rows.map((row) => row.id_doacao);

        const query = `
            SELECT 
                doacao.id_doacao, doacao.doacao_alimento, doacao.doacao_qtd, doacao.doacao_data, 
                doacao.doacao_obs, doacao.doacao_horario, cadastro_doador.doador_endereco
            FROM 
                doacao
            INNER JOIN 
                cadastro_doador ON doacao.id_doador = cadastro_doador.id_doador
        `;
        const result = await pool.query(query);

        const doacoesDisponiveis = result.rows.filter((doacao) => !doacoesSolicitadasIds.includes(doacao.id_doacao));
        const doacoesFormatadas = doacoesDisponiveis.map((doacao) => ({
            ...doacao,
            doacao_data: formataData(doacao.doacao_data),
        }));

        res.render('solicitar', { doacoes: doacoesFormatadas });
    } catch (error) {
        console.error('Erro ao consultar o banco de dados:', error);
        res.status(500).send('Erro ao carregar doações');
    }
});

// Rota: Processar solicitação
router.post('/fazerSolicitacao', verificarAutenticacao, async (req, res) => {
    const { solicitacao_alimento, solicitacao_qtd, solicitacao_obs, endereco_retirada, solicitacao_data, solicitacao_horario } = req.body;
    const userId = req.session.userId;

    try {
        const query = `
            INSERT INTO solicitacao 
            (solicitacao_alimento, solicitacao_qtd, solicitacao_obs, endereco_retirada, solicitacao_data, solicitacao_horario, id_beneficiario)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id_solicitacao
        `;
        const values = [solicitacao_alimento, solicitacao_qtd, solicitacao_obs, endereco_retirada, solicitacao_data, solicitacao_horario, userId];
        const result = await pool.query(query, values);

        res.send(`<script>alert('Solicitação cadastrada com sucesso! ID: ${result.rows[0].id_solicitacao}'); window.location.href = '/solicitar';</script>`);
    } catch (error) {
        console.error('Erro ao cadastrar solicitação:', error);
        res.status(500).send('<script>alert("Erro ao cadastrar a solicitação. Tente novamente mais tarde."); window.location.href = "/solicitar";</script>');
    }
});

module.exports = router;
