const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const pool = require('../config/database'); // Importando a conexão com o banco de dados

// Configuração do Nodemailer (substitua com suas credenciais)
const transporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
        user: 'seu-email@outlook.com',
        pass: 'sua-senha' // Pode ser necessário gerar uma senha de aplicativo se tiver autenticação em duas etapas ativada
    }
});
// Rota para solicitar a redefinição de senha
router.post('/esqueceu', async (req, res) => {
    const { email } = req.body;

    console.log('E-mail recebido:', email); // Para depuração

    try {
        // Verifique se o beneficiário existe
        const userResult = await pool.query('SELECT * FROM cadastro_beneficiario WHERE benef_email = $1', [email]);
        console.log('Resultado da consulta:', userResult.rows); // Para depuração

        const user = userResult.rows[0];

        if (!user) {
            return res.status(400).send('Beneficiário não encontrado');
        }

        // Gerar um token de redefinição
        const token = crypto.randomBytes(20).toString('hex');
        await pool.query('UPDATE cadastro_beneficiario SET reset_token = $1 WHERE benef_email = $2', [token, email]);

        // Enviar e-mail com o link de redefinição
        const mailOptions = {
            from: 'seuemail@gmail.com',
            to: email,
            subject: 'Redefinição de senha',
            text: `Clique no link para redefinir sua senha: http://localhost:3000/redefinir/${token}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send('E-mail de redefinição enviado com sucesso');
    } catch (error) {
        console.error('Erro ao processar a solicitação:', error);
        res.status(500).send('Erro ao enviar e-mail');
    }
});

// Rota para redefinir a senha
router.get('/redefinir/:token', async (req, res) => {
    const { token } = req.params;

    try {
        // Verifique o token no banco de dados
        const userResult = await pool.query('SELECT * FROM cadastro_beneficiario WHERE reset_token = $1', [token]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(400).send('Token inválido ou expirado');
        }

        // Aqui você deve exibir um formulário para o usuário redefinir a senha
        res.send(`<form action="/reset" method="post">
                    <input type="hidden" name="email" value="${user.benef_email}" />
                    <input type="password" name="newPassword" placeholder="Nova senha" required />
                    <button type="submit">Redefinir senha</button>
                  </form>`);
    } catch (error) {
        console.error('Erro ao acessar o token:', error);
        res.status(500).send('Erro ao processar a solicitação');
    }
});

// Rota para processar a redefinição da senha
router.post('/reset', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        // Verifique se o beneficiário existe
        const userResult = await pool.query('SELECT * FROM cadastro_beneficiario WHERE benef_email = $1', [email]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(400).send('Beneficiário não encontrado');
        }

        // Atualize a senha do beneficiário
        await pool.query('UPDATE cadastro_beneficiario SET benef_senha = $1, reset_token = NULL WHERE benef_email = $2', [newPassword, email]);
        res.send('Senha redefinida com sucesso');
    } catch (error) {
        console.error('Erro ao redefinir a senha:', error);
        res.status(500).send('Erro ao redefinir a senha');
    }
});

module.exports = router; // Exportando o router
