const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { format } = require('date-fns');
const { ptBR } = require('date-fns/locale'); 
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
        doador_complemento
    } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(doador_senha, saltRounds);

        const query = `
            INSERT INTO cadastro_doador 
            (nome_razao, doador_documento, doador_telefone, doador_data_nasc, doador_email, doador_senha, doador_cep, doador_cidade, doador_UF, doador_endereco, doador_numero, doador_bairro, doador_complemento) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
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
            doador_complemento
        ];

        const result = await pool.query(query, values);
        
        res.send(`<script>alert('Doador cadastrado com sucesso! ID: ${result.rows[0].id_doador}'); window.location.href = '/loginDoador';</script>`);
    } catch (error) {
        console.error('Erro ao cadastrar doador:', error);
        res.send(`<script>alert('Erro ao cadastrar doador. Tente novamente.'); window.location.href = '/doador';</script>`);
    }
});

// Rota para exibir a página principal do doador
// Rota para a página principal do doador
// Rota para exibir a página do doador
router.get('/doadorHome', async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/loginDoador');
    }

    try {
        // Consultar informações do doador
        const doadorQuery = `
            SELECT nome_razao, doador_email, doador_endereco, doador_bairro, doador_cidade, doador_UF, doador_cep 
            FROM cadastro_doador 
            WHERE id_doador = $1
        `;
        const doadorResult = await pool.query(doadorQuery, [userId]);

        if (doadorResult.rows.length === 0) {
            return res.send('Usuário não encontrado');
        }

        const doador = doadorResult.rows[0];

        // Consultar doações associadas ao doador
        const doacoesQuery = `
            SELECT doacao_alimento, doacao_qtd, doacao_obs, doacao_data, doacao_horario 
            FROM doacao 
            WHERE id_doador = $1
        `;
        const doacoesResult = await pool.query(doacoesQuery, [userId]);

        // Consultar notificações não lidas
        const notificacoesQuery = `
            SELECT id_notificacao, notificacao_texto 
            FROM notificacao 
            WHERE id_doador = $1 AND lida = FALSE
        `;
        const notificacoesResult = await pool.query(notificacoesQuery, [userId]);
        const notificacoes = notificacoesResult.rows;

        // Formatar as datas antes de enviar para o EJS
        const doacoes = doacoesResult.rows.map(doacao => ({
            ...doacao,
            doacao_data: doacao.doacao_data ? format(new Date(doacao.doacao_data), 'dd/MM/yyyy', { locale: ptBR }) : '' // Formata a data
        }));

        // Renderizar página com os dados
        res.render('doadorHome', { 
            nome_razao: doador.nome_razao,
            doador_email: doador.doador_email,
            doador_endereco: doador.doador_endereco,
            doador_bairro: doador.doador_bairro,
            doador_cidade: doador.doador_cidade,
            doador_UF: doador.doador_UF,
            doador_cep: doador.doador_cep,
            doacoes, // Passando as doações formatadas para o EJS
            notificacoes // Passando as notificações para o EJS
        });
    } catch (error) {
        console.error('Erro ao consultar o banco de dados:', error);
        res.send('Erro ao buscar informações do usuário');
    }
});

router.post('/notificacao/lida/:id', async (req, res) => {
    const notificacaoId = req.params.id;

    try {
        const updateQuery = `
            UPDATE notificacao
            SET lida = TRUE
            WHERE id_notificacao = $1
        `;
        await pool.query(updateQuery, [notificacaoId]);

        // Redirecionar para a página inicial do doador
        res.redirect('/doadorHome');
    } catch (error) {
        console.error('Erro ao marcar notificação como lida:', error.message);
        res.status(500).send('Erro ao processar sua solicitação.');
    }
});


// Rota para a página de doação
router.get('/fazerdoacao', (req, res) => { 
    const userId = req.session.userId; // Certifique-se de que o ID do usuário está na sessão
    if (!userId) {
        return res.redirect('/loginDoador');
    }
    res.render('fazerdoacao', { userId });  // Passa o ID para o formulário
});


// Rota para processar a doação
router.post('/fazerDoacao', async (req, res) => {
    const { doacao_alimento, doacao_qtd, doacao_obs, doacao_data, doacao_horario, id_doador } = req.body; 

    try { 
        const query = `
            INSERT INTO doacao (doacao_alimento, doacao_qtd, doacao_obs, doacao_data, doacao_horario, id_doador) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING id_doacao`; 
        const values = [doacao_alimento, doacao_qtd, doacao_obs, doacao_data, doacao_horario, id_doador]; 
        const result = await pool.query(query, values); 
        
        res.send(`<script>alert('Doação realizada! ID: ${result.rows[0].id_doacao}'); window.location.href = '/fazerdoacao';</script>`); 
    } catch (error) { 
        console.error('Erro ao realizar a doação:', error); 
        res.send(`<script>alert('Erro ao realizar a doação. Tente novamente.'); window.location.href = '/fazerdoacao';</script>`); 
    }
});


router.get('/editar', async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.redirect('/loginDoador');
    }

    try {
        const query = `
            SELECT nome_razao, doador_email, doador_endereco, doador_bairro, doador_cidade, doador_cep, doador_telefone, doador_UF
            FROM cadastro_doador 
            WHERE id_doador = $1
        `;
        const result = await pool.query(query, [userId]);

        if (result.rows.length > 0) {
            const doador = result.rows[0];
            res.render('editar', { 
                userId,
                nome_razao: doador.nome_razao,
                doador_email: doador.doador_email,
                doador_endereco: doador.doador_endereco,
                doador_bairro: doador.doador_bairro,
                doador_cidade: doador.doador_cidade,
                doador_cep: doador.doador_cep,
                doador_telefone: doador.doador_telefone,
                doador_UF: doador.doador_UF
            });
        } else {
            res.send('Usuário não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao buscar informações do usuário:', error);
        res.send('Erro ao carregar informações do usuário.');
    }
});



// Rota para editar a conta do doador
router.post('/editarDoador', async (req, res) => {
    const { 
        id_doador, 
        doador_email, 
        doador_endereco, 
        doador_cidade, 
        doador_UF, 
        doador_bairro, 
        doador_cep, 
        doador_telefone,      
        nova_senha
    } = req.body;

    const dadosAtualizados = {
        doador_email,
        doador_endereco,
        doador_cidade,
        doador_UF,
        doador_bairro,
        doador_cep,
        doador_telefone
    };

    try {
        // Início da query de atualização
        let query = `
            UPDATE cadastro_doador 
            SET doador_email = $1, 
                doador_endereco = $2, 
                doador_cidade = $3, 
                doador_UF = $4, 
                doador_bairro = $5, 
                doador_cep = $6,
                doador_telefone = $7
        `;
        const values = [
            doador_email, 
            doador_endereco, 
            doador_cidade, 
            doador_UF, 
            doador_bairro, 
            doador_cep,
            doador_telefone
        ];

        // Se uma nova senha foi fornecida, criptografar e incluir na query
        if (nova_senha && nova_senha.trim() !== '') {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(nova_senha, saltRounds);
            query += `, doador_senha = $8`;
            values.push(hashedPassword);
        }

        // Finalizar a query com a cláusula WHERE
        query += ` WHERE id_doador = $${values.length + 1}`;
        values.push(id_doador);

        console.log("Executando query com os valores:", values);

        // Executa a consulta no banco de dados
        await pool.query(query, values);

        // Enviar resposta de sucesso
        res.send(`<script>alert('Conta editada com sucesso!'); window.location.href = '/doadorHome';</script>`);
    } catch (error) {
        console.error('Erro ao editar conta do doador:', error);
        res.send(`<script>alert('Erro ao editar conta. Tente novamente.'); window.location.href = '/doadorHome';</script>`);
    }
});


module.exports = router;