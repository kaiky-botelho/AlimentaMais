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

router.get('/editarBenef', async (req, res) => {
    const userId = req.session.userId;
    console.log('userId:', userId); // Debug
    if (!userId) {
        return res.redirect('/loginBenef');
    }

    try {
        const query = `
            SELECT nome, benef_email, benef_endereco, benef_bairro, benef_cidade, benef_UF, benef_cep
            FROM cadastro_beneficiario
            WHERE id_beneficiario = $1
        `;
        const result = await pool.query(query, [userId]);
        console.log('Result rows:', result.rows); // Debug

        if (result.rows.length > 0) {
            const beneficiario = result.rows[0];
            res.render('editarBenef', {
                userId,
                nome: beneficiario.nome,
                benef_email: beneficiario.benef_email,
                benef_endereco: beneficiario.benef_endereco,
                benef_bairro: beneficiario.benef_bairro,
                benef_cidade: beneficiario.benef_cidade,
                benef_UF: beneficiario.benef_UF,
                benef_cep: beneficiario.benef_cep,
            });
        } else {
            console.log('Usuário não encontrado');
            res.send('Usuário não encontrado');
        }
    } catch (error) {
        console.error('Erro ao buscar informações do usuário:', error);
        res.send('Erro ao carregar informações do usuário.');
    }
});

router.post('/editarBeneficiario', async (req, res) => {
    const { id_beneficiario, benef_email, benef_endereco, benef_cidade, benef_UF, benef_bairro, benef_cep } = req.body;

    console.log('Dados recebidos:', req.body); // Verificando o corpo da requisição

    const dadosAtualizados = {
        benef_email, 
        benef_endereco, 
        benef_cidade, 
        benef_UF, 
        benef_bairro, 
        benef_cep
    };

    try {
        const query = `
            UPDATE cadastro_beneficiario 
            SET benef_email = $1, 
                benef_endereco = $2, 
                benef_cidade = $3, 
                benef_UF = $4, 
                benef_bairro = $5, 
                benef_cep = $6
            WHERE id_beneficiario = $7
        `;

        const values = [
            benef_email, 
            benef_endereco, 
            benef_cidade, 
            benef_UF, 
            benef_bairro, 
            benef_cep,
            id_beneficiario
        ];

        console.log("Executando query com os valores:", values);

        // Executa a consulta no banco de dados
        await pool.query(query, values);

        // Enviar resposta de sucesso
        res.send(`<script>alert('Conta editada com sucesso!'); window.location.href = '/beneficiarioHome';</script>`);
    } catch (error) {
        console.error('Erro ao editar conta do beneficiário:', error);
        res.send(`<script>alert('Erro ao editar conta. Tente novamente.'); window.location.href = '/beneficiarioHome';</script>`);
    }
});

module.exports = router;