const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { format } = require('date-fns');
const { ptBR } = require('date-fns/locale');
const pool = require('../config/database');

// Função para calcular a idade
function calcularIdade(dataNasc) {
    const hoje = new Date();
    const nascimento = new Date(dataNasc);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    return idade;
}

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
        // Validar idade
        const idade = calcularIdade(benef_data_nasc);
        if (idade < 18) {
            return res.send(`<script>alert('Cadastro permitido apenas para maiores de 18 anos.'); window.location.href = '/beneficiario';</script>`);
        }

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

module.exports = router;
