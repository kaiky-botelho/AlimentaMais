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
// Rota para a página principal do doador
router.get('/doadorHome', async (req, res) => { 
    const userId = req.session.userId;
    
    if (!userId) {
        return res.redirect('/loginDoador');
    }
    
    try {
        const query = 'SELECT nome_razao, doador_email, doador_endereco, doador_bairro, doador_cidade, doador_UF, doador_cep FROM cadastro_doador WHERE id_doador = $1';
        const result = await pool.query(query, [userId]);

        if (result.rows.length > 0) {
            const doador = result.rows[0];

            // Passando dados para o EJS, agora com o bairro
            res.render('doadorHome', { 
                nome_razao: doador.nome_razao,
                doador_email: doador.doador_email,
                doador_endereco: doador.doador_endereco,
                doador_bairro: doador.doador_bairro, // Aqui está a correção
                doador_cidade: doador.doador_cidade,
                doador_UF: doador.doador_UF,
                doador_cep: doador.doador_cep
            });
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
    const userId = req.session.userId; // Certifique-se de que o ID do usuário está na sessão
    if (!userId) {
        return res.redirect('/loginDoador');
    }
    res.render('fazerdoacao', { userId });  // Passa o ID para o formulário
});


// Rota para processar a doação
router.post('/fazerDoacao', async (req, res) => {
    const { doacao_alimento, doacao_qtd, doacao_obs, entregaColeta, doacao_data, doacao_horario, id_doador } = req.body; 

    if (!['Entregar pessoalmente', 'Retirar no endereço'].includes(entregaColeta)) {
        return res.send(`<script>alert('Valor inválido para entrega. Selecione entre "Entregar pessoalmente" ou "Retirar no endereço".'); window.location.href = '/fazerdoacao';</script>`);
    }

    try { 
        const query = `
            INSERT INTO doacao (doacao_alimento, doacao_qtd, doacao_obs, doacao_entrega, doacao_data, doacao_horario, id_doador) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING id_doacao`; 
        const values = [doacao_alimento, doacao_qtd, doacao_obs, entregaColeta, doacao_data, doacao_horario, id_doador]; 
        const result = await pool.query(query, values); 
        
        res.send(`<script>alert('Doação realizada! ID: ${result.rows[0].id_doacao}'); window.location.href = '/fazerdoacao';</script>`); 
    } catch (error) { 
        console.error('Erro ao realizar a doação:', error); 
        res.send(`<script>alert('Erro ao realizar a doação. Tente novamente.'); window.location.href = '/fazerdoacao';</script>`); 
    }
});



// Rota para editar a conta do doador
router.post('/editarDoador', async (req, res) => {
    const { id_doador, nome_razao, doador_email, doador_endereco, doador_cidade, doador_UF, doador_bairro, doador_cep } = req.body;

    console.log('Dados recebidos:', req.body); // Verificando o corpo da requisição

    const dadosAtualizados = {
        nome_razao,
        doador_email,
        doador_endereco,
        doador_cidade,
        doador_UF,
        doador_bairro,
        doador_cep
    };

    try {
        const query = `
            UPDATE cadastro_doador 
            SET nome_razao = $1, 
                doador_email = $2, 
                doador_endereco = $3, 
                doador_cidade = $4, 
                doador_UF = $5, 
                doador_bairro = $6, 
                doador_cep = $7
            WHERE id_doador = $8
        `;

        const values = [
            nome_razao, 
            doador_email, 
            doador_endereco, 
            doador_cidade, 
            doador_UF, 
            doador_bairro, 
            doador_cep,
            id_doador // Aqui está o ID do doador
        ];

        console.log("Executando query com os valores:", values); // Verificando os valores enviados à consulta

        // Executa a consulta no banco de dados
        await pool.query(query, values);

        // Enviar resposta de sucesso
        res.send(`<script>alert('Conta editada com sucesso!'); window.location.href = '/doadorHome';</script>`);
    } catch (error) {
        console.error('Erro ao editar conta do doador:', error);
        res.send(`<script>alert('Erro ao editar conta. Tente novamente.'); window.location.href = '/doadorHome';</script>`);
    }
});

// Rota para deletar a conta do doador
router.post('/deletarDoador', async (req, res) => {
    const { id_doador } = req.body;

    try {
        const query = 'DELETE FROM cadastro_doador WHERE id_doador = $1';
        await pool.query(query, [id_doador]);
        res.send(`<script>alert('Conta deletada com sucesso!'); window.location.href = '/';</script>`);
    } catch (error) {
        console.error('Erro ao deletar conta do doador:', error);
        res.send(`<script>alert('Erro ao deletar conta. Tente novamente.'); window.location.href = '/doadorHome';</script>`);
    }
});

module.exports = router;
