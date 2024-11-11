const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../config/database');

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
        preferencia_contato 
    } = req.body;

    const frequenciaDoacaoString = Array.isArray(frequencia_doacao) ? frequencia_doacao.join(', ') : frequencia_doacao;
    const preferenciaContatoString = Array.isArray(preferencia_contato) ? preferencia_contato.join(', ') : preferencia_contato;

    try {
        // Criptografa a senha antes de armazená-la
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(doador_senha, saltRounds);

        const query = `
            INSERT INTO cadastro_doador 
            (nome_razao, doador_documento, doador_telefone, doador_data_nasc, doador_email, doador_senha, doador_cep, doador_cidade, doador_UF, doador_endereco, doador_numero, doador_bairro, doador_complemento, frequencia_doacao, preferencia_contato) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
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
            frequenciaDoacaoString, 
            preferenciaContatoString
        ];

        const result = await pool.query(query, values);
        
        res.send(`<script>alert('Doador cadastrado com sucesso! ID: ${result.rows[0].id_doador}'); window.location.href = '/doador';</script>`);
    } catch (error) {
        console.error('Erro ao cadastrar doador:', error);
        res.send(`<script>alert('Erro ao cadastrar doador. Tente novamente.'); window.location.href = '/doador';</script>`);
    }
});

// Rota para exibir a página principal do doador
router.get('/doadorHome', async (req, res) => { 
    const userId = req.session.userId;
    
    if (!userId) {
        return res.redirect('/login'); // Se o usuário não estiver logado, redireciona para o login
    }
    
    try {
        // Consultar o nome do usuário no banco de dados
        const query = 'SELECT nome_razao FROM cadastro_doador WHERE id_doador = $1';
        const result = await pool.query(query, [userId]);

        if (result.rows.length > 0) {
            const nomeUsuario = result.rows[0].nome_razao;
            // Passar o nome do usuário para a página EJS
            res.render('doadorHome', { nome_razao: nomeUsuario });
        } else {
            res.send('Usuário não encontrado');
        }
    } catch (error) {
        console.error('Erro ao consultar o banco de dados:', error);
        res.send('Erro ao buscar informações do usuário');
    }
});

// Rota para a página de doação
router.get('/fazerdoacao', (req, res) => { 
    res.render('fazerdoacao');  
});

// Rota para processar a doação
router.post('/fazerDoacao', async (req, res) => {
    const { doacao_alimento, doacao_qtd, doacao_obs, entregaColeta, doacao_data, doacao_horario } = req.body; 
    try { 
        const query = 'INSERT INTO doacao (doacao_alimento, doacao_qtd, doacao_obs, doacao_entrega, doacao_data, doacao_horario) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_doacao'; 
        const values = [doacao_alimento, doacao_qtd, doacao_obs, entregaColeta, doacao_data, doacao_horario]; 
        const result = await pool.query(query, values); 
        
        res.send(`<script>alert('Doação realizada! ID: ${result.rows[0].id_doacao}'); window.location.href = '/fazerdoacao';</script>`); 
    } catch (error) { 
        console.error('Erro ao realizar a doação:', error); 
        res.send(`<script>alert('Erro ao realizar a doação. Tente novamente.'); window.location.href = '/fazerdoacao';</script>`); 
    }
});

module.exports = router;
