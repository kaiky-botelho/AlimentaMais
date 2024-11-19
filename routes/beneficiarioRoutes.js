    const express = require('express');
    const bcrypt = require('bcrypt');
    const router = express.Router();
    const { format } = require('date-fns');
    const { ptBR } = require('date-fns/locale');
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
            return res.redirect('/loginBenef');
        }

        try {
            // Consultar informações do beneficiário
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

            // Consultar solicitações associadas ao beneficiário
            const solicitacaoQuery = `
                SELECT solicitacao_alimento, solicitacao_qtd, solicitacao_obs, solicitacao_entrega, solicitacao_data, solicitacao_horario 
                FROM solicitacao 
                WHERE id_beneficiario = $1
            `;
            const solicitacaoResult = await pool.query(solicitacaoQuery, [userId]);

            // Formatar as datas antes de enviar para o EJS
            const solicitacoes = solicitacaoResult.rows.map(solicitacao => ({
                ...solicitacao,
                solicitacao_data: solicitacao.solicitacao_data ? format(new Date(solicitacao.solicitacao_data), 'dd/MM/yyyy', { locale: ptBR }) : '' // Formata a data
            }));

            // Renderizar página com os dados do beneficiário e suas solicitações
            res.render('beneficiarioHome', { 
                nome: beneficiario.nome,
                benef_email: beneficiario.benef_email,
                benef_endereco: beneficiario.benef_endereco,
                benef_bairro: beneficiario.benef_bairro,
                benef_cidade: beneficiario.benef_cidade,
                benef_UF: beneficiario.benef_UF,
                benef_cep: beneficiario.benef_cep,
                solicitacoes // Passando as solicitações formatadas para o EJS
            });
        } catch (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            res.send('Erro ao buscar informações do usuário');
        }
    });


// Rota para exibir o formulário de solicitação
router.get('/solicitar', async (req, res) => {
    const userId = req.session.userId; // Certifique-se de que o ID do usuário está na sessão
    if (!userId) {
        return res.redirect('/loginBenef');
    }

    try {
        // Consultar doações
        const doacaoResult = await pool.query('SELECT id_doacao, doacao_alimento, doacao_qtd FROM doacao');
        const doacoes = doacaoResult.rows || [];

        // Consultar doadores
        const doadorResult = await pool.query('SELECT id_doador, doador_endereco FROM cadastro_doador');
        const doadores = doadorResult.rows || [];

        res.render('solicitar', { doacoes, doadores, userId });
    } catch (error) {
        console.error('Erro ao consultar o banco de dados:', error);
        res.status(500).send('Erro ao carregar doações');
    }
});

// Rota para processar a solicitação
router.post('/fazerSolicitacao', async (req, res) => {
    const { solicitacao_alimento, solicitacao_qtd, solicitacao_obs, solicitacao_entrega, solicitacao_data, solicitacao_horario } = req.body;

    // Obter o ID do beneficiário da sessão
    const userId = req.session.userId; 
    if (!userId) {
        return res.redirect('/loginBenef');
    }

    // Verificar se o método de entrega é válido
    if (!['Entregar pessoalmente', 'Retirar no endereço'].includes(solicitacao_entrega)) {
        return res.send(`<script>alert('Valor inválido para entrega. Selecione entre "Entregar pessoalmente" ou "Retirar no endereço".'); window.location.href = '/solicitar';</script>`);
    }

    try {
        // Inserir a solicitação no banco de dados
        const query = `
            INSERT INTO solicitacao (solicitacao_alimento, solicitacao_qtd, solicitacao_obs, solicitacao_entrega, solicitacao_data, solicitacao_horario, id_beneficiario)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_solicitacao
        `;
        const values = [solicitacao_alimento, solicitacao_qtd, solicitacao_obs, solicitacao_entrega, solicitacao_data, solicitacao_horario, userId];
        const result = await pool.query(query, values);

        // Atualizar a quantidade de doação ou deletar a doação se não houver mais quantidade
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

        // Resposta de sucesso
        res.send(`<script>alert('Solicitação cadastrada com sucesso! ID: ${result.rows[0].id_solicitacao}'); window.location.href = '/solicitar';</script>`);
    } catch (error) {
        console.error('Erro ao cadastrar a solicitação:', error);
        res.status(500).send(`<script>alert('Erro ao cadastrar a solicitação. Tente novamente.'); window.location.href = '/solicitar';</script>`);
    }
});


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
