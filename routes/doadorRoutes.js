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

// Rota para exibir o formulário de doador
router.get('/doador', (req, res) => {
    res.render('doador');
});

// Rota para processar o formulário de cadastro de doadores
router.post('/cadastroDoador', async (req, res) => {
    const { 
        nome_razao, 
        doador_documento, 
        doador_telefone, 
        doador_data_nasc, 
        doador_email, 
        doador_senha, 
        doador_cep, 
        doador_cidade, 
        doador_UF, 
        doador_endereco, 
        doador_numero, 
        doador_bairro, 
        doador_complemento, 
        frequencia_doacao, 
    } = req.body;

    try {
        // Validar idade
        const idade = calcularIdade(doador_data_nasc);
        if (idade < 18) {
            return res.send(`<script>alert('Cadastro permitido apenas para maiores de 18 anos.'); window.location.href = '/doador';</script>`);
        }

        // Hash da senha
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(doador_senha, saltRounds);

        const query = `
            INSERT INTO cadastro_doador 
            (nome_razao, doador_documento, doador_telefone, doador_data_nasc, doador_email, doador_senha, doador_cep, doador_cidade, doador_UF, doador_endereco, doador_numero, doador_bairro, doador_complemento, frequencia_doacao) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
            RETURNING id_doador
        `;
        
        const values = [
            nome_razao, 
            doador_documento, 
            doador_telefone, 
            doador_data_nasc, 
            doador_email, 
            hashedPassword, 
            doador_cep, 
            doador_cidade, 
            doador_UF, 
            doador_endereco, 
            doador_numero, 
            doador_bairro, 
            doador_complemento, 
            frequencia_doacao
        ];

        const result = await pool.query(query, values);
        
        res.send(`<script>alert('Doador cadastrado com sucesso! ID: ${result.rows[0].id_doador}'); window.location.href = '/doador';</script>`);
    } catch (error) {
        console.error('Erro ao cadastrar doador:', error);
        res.send(`<script>alert('Erro ao cadastrar doador. Tente novamente.'); window.location.href = '/doador';</script>`);
    }
});

module.exports = router;
