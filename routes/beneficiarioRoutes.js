const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { format } = require('date-fns');
const { ptBR } = require('date-fns/locale');
const pool = require('../config/database');

// Função para validar a categoria de renda

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
            SELECT solicitacao_alimento, solicitacao_qtd, solicitacao_obs, endereco_retirada, solicitacao_data, solicitacao_horario 
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
// Rota para exibir o formulário de solicitação
router.get('/solicitar', async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.redirect('/loginBenef');
    }

    try {
        // Buscar os IDs das doações já solicitadas
        const solicitadosQuery = `
            SELECT id_doacao 
            FROM solicitacao 
            WHERE id_beneficiario = $1
        `;
        const solicitadosResult = await pool.query(solicitadosQuery, [userId]);
        const doacoesSolicitadasIds = solicitadosResult.rows.map(row => row.id_doacao);

        // Buscar as doações disponíveis
        const query = `
            SELECT 
                doacao.id_doacao,
                doacao.doacao_alimento,
                doacao.doacao_qtd,
                doacao.doacao_data,
                doacao.doacao_obs,
                doacao.doacao_horario,
                cadastro_doador.doador_endereco
            FROM 
                doacao
            INNER JOIN 
                cadastro_doador ON doacao.id_doador = cadastro_doador.id_doador
        `;
        const result = await pool.query(query);
        const doacoes = result.rows || [];

        // Filtrar as doações para remover as que já foram solicitadas
        const doacoesDisponiveis = doacoes.filter(doacao => !doacoesSolicitadasIds.includes(doacao.id_doacao));

        // Garantir que a data seja um objeto Date válido antes de enviar
        const doacoesComDataFormatada = doacoesDisponiveis.map(doacao => {
            return {
                ...doacao,
                doacao_data: doacao.doacao_data ? new Date(doacao.doacao_data) : null // Verifica se a data é válida
            };
        });

        res.render('solicitar', { doacoes: doacoesComDataFormatada, userId });
    } catch (error) {
        console.error('Erro ao consultar o banco de dados:', error);
        res.status(500).send('Erro ao carregar doações');
    }
});


// Rota para processar a solicitação
router.post('/fazerSolicitacao', async (req, res) => {
    const { solicitacao_alimento, solicitacao_qtd, solicitacao_obs, endereco_retirada, solicitacao_data, solicitacao_horario } = req.body;

    const userId = req.session?.userId; 
    if (!userId) {
        return res.redirect('/loginBenef');
    }

    try {
        const insertQuery = `
            INSERT INTO solicitacao (solicitacao_alimento, solicitacao_qtd, solicitacao_obs, endereco_retirada, solicitacao_data, solicitacao_horario, id_beneficiario)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_solicitacao
        `;
        const insertValues = [solicitacao_alimento, solicitacao_qtd, solicitacao_obs, endereco_retirada, solicitacao_data, solicitacao_horario, userId];
        const result = await pool.query(insertQuery, insertValues);

        const doadorQuery = `
            SELECT id_doador, id_doacao FROM doacao 
            WHERE doacao_alimento = $1 AND doacao_qtd >= $2
            LIMIT 1
        `;
        const doadorResult = await pool.query(doadorQuery, [solicitacao_alimento, solicitacao_qtd]);

        if (doadorResult.rowCount === 0) {
            return res.status(400).send(`
                <script>
                    alert('Não foi possível encontrar uma doação correspondente. Verifique os dados e tente novamente.');
                    window.location.href = '/solicitar';
                </script>
            `);
        }

        const idDoador = doadorResult.rows[0].id_doador;
        const idDoacao = doadorResult.rows[0].id_doacao;

        const beneficiarioQuery = `
            SELECT nome FROM cadastro_beneficiario 
            WHERE id_beneficiario = $1
        `;
        const beneficiarioResult = await pool.query(beneficiarioQuery, [userId]);

        if (beneficiarioResult.rowCount === 0) {
            return res.status(400).send('Beneficiário não encontrado');
        }

        const beneficiarioNome = beneficiarioResult.rows[0].nome;

        // Formatar a data para pt-BR
        const dataFormatada = format(new Date(solicitacao_data), 'dd/MM/yyyy', { locale: ptBR });

        // Criar notificação para o doador
        const notificacaoTexto = `
            ${beneficiarioNome} irá resgatar o ${solicitacao_alimento} no dia ${dataFormatada} no horário ${solicitacao_horario}.
        `;
        const insertNotificacaoQuery = `
            INSERT INTO notificacao (id_doador, id_solicitacao, notificacao_texto)
            VALUES ($1, $2, $3)
        `;
        await pool.query(insertNotificacaoQuery, [idDoador, result.rows[0].id_solicitacao, notificacaoTexto]);

        const deleteDoacaoQuery = `
            DELETE FROM doacao
            WHERE id_doacao = $1
        `;
        await pool.query(deleteDoacaoQuery, [idDoacao]);

        res.send(`
            <script>
                alert('Solicitação cadastrada com sucesso! ID: ${result.rows[0].id_solicitacao}');
                window.location.href = '/solicitar';
            </script>
        `);
    } catch (error) {
        console.error('Erro ao cadastrar a solicitação:', error.message);
        res.status(500).send(`
            <script>
                alert('Erro ao cadastrar a solicitação. Tente novamente mais tarde.');
                window.location.href = '/solicitar';
            </script>
        `);
    }
});

// Rota para exibir informações de beneficiário para edição
router.get('/editarBenef', async (req, res) => {
    const userId = req.session.userId;
    console.log('userId:', userId); // Debug
    if (!userId) {
        return res.redirect('/loginBenef');
    }

    try {
        const query = `
            SELECT nome, benef_email, benef_endereco, benef_bairro, benef_cidade, benef_UF, benef_cep, benef_telefone
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
                benef_telefone: beneficiario.benef_telefone
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

// Rota para processar edição de beneficiários
router.post('/editarBeneficiario', async (req, res) => {
    const { 
        id_beneficiario, 
        benef_email, 
        benef_endereco, 
        benef_cidade, 
        benef_UF, 
        benef_bairro, 
        benef_cep, 
        nova_senha 
    } = req.body;

    const dadosAtualizados = {
        benef_email, 
        benef_endereco, 
        benef_cidade, 
        benef_UF, 
        benef_bairro, 
        benef_cep
    };

    try {
        // Início da query de atualização
        let query = `
            UPDATE cadastro_beneficiario 
            SET benef_email = $1, 
                benef_endereco = $2, 
                benef_cidade = $3, 
                benef_UF = $4, 
                benef_bairro = $5, 
                benef_cep = $6
        `;
        const values = [
            benef_email, 
            benef_endereco, 
            benef_cidade, 
            benef_UF, 
            benef_bairro, 
            benef_cep
        ];

        // Se uma nova senha foi fornecida, criptografar e incluir na query
        if (nova_senha && nova_senha.trim() !== '') {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(nova_senha, saltRounds);
            query += `, benef_senha = $7`;  // Inclui a senha na query
            values.push(hashedPassword);   // Adiciona o valor da senha
        }

        // Finaliza a query com a cláusula WHERE
        query += ` WHERE id_beneficiario = $${values.length + 1}`;
        values.push(id_beneficiario);  // Adiciona o id do beneficiário no final

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