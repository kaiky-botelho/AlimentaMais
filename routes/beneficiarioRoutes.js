const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/beneficiario', (req, res) => {
    res.render('beneficiario');  
  });

  router.post('/cadastroBeneficiario', async (req, res) => {
    const { nome, benef_documento, benef_telefone, benef_data_nasc, benef_email, benef_senha, benef_cep, benef_cidade, benef_UF, benef_endereco, benef_numero, benef_bairro, benef_complemento, renda} = req.body; 
  
    try { 
      const query = 'INSERT INTO cadastro_beneficiario (nome, benef_documento, benef_telefone, benef_data_nasc, benef_email, benef_senha, benef_cep, benef_cidade, benef_UF, benef_endereco, benef_numero, benef_bairro, benef_complemento, renda) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id_beneficiario'; 
      const values = [nome, benef_documento, benef_telefone, benef_data_nasc, benef_email, benef_senha, benef_cep, benef_cidade, benef_UF, benef_endereco, benef_numero, benef_bairro, benef_complemento, renda]; 
      const result = await pool.query(query, values); //
      
      res.send(`<script>alert('Beneficiario cadastrado com sucesso! ID: ${result.rows[0].id_beneficiario}'); window.location.href = '/beneficiario';</script>`); 
    } catch (error) { 
      console.error('Erro ao cadastrar beneficiario:', error); // 
      res.send(`<script>alert('Erro ao cadastrar beneficiario. Tente novamente.'); window.location.href = '/beneficiario';</script>`); 
    }
  });

  router.get('/beneficiarioHome', (req, res) => {
    res.render('beneficiarioHome');  
  });

  router.get('/solicitar', async (req, res) => {
    try {
        // Alteração na consulta para também retornar a quantidade (doacao_qtd) e os endereços dos doadores
        const doacaoResult = await pool.query('SELECT id_doacao, doacao_alimento, doacao_qtd FROM doacao');
        const doacoes = doacaoResult.rows || [];

        // Consulta para obter os endereços dos doadores
        const doadorResult = await pool.query('SELECT id_doador, doador_endereco FROM cadastro_doador');
        const doadores = doadorResult.rows || [];

        // Renderiza a página 'solicitar' com a lista de doações, quantidades e os endereços dos doadores
        res.render('solicitar', { doacoes, doadores });
    } catch (error) {
        console.error('Erro ao consultar o banco de dados:', error.message); // Detalhe do erro
        res.status(500).send('Erro ao carregar doações');
    }
});

router.post('/fazerSolicitacao', async (req, res) => {
  const { solicitacao_alimento, solicitacao_qtd, solicitacao_obs, solicitacao_entrega, solicitacao_data, solicitacao_horario } = req.body;

  console.log('Valor recebido para solicitacao_entrega:', solicitacao_entrega); // Log para depuração

  if (!['Entregar pessoalmente', 'Retirar no endereço'].includes(solicitacao_entrega)) {
      return res.send(`<script>alert('Valor inválido para entrega. Selecione entre "Entregar pessoalmente" ou "Retirar no endereço".'); window.location.href = '/solicitar';</script>`);
  }

  try {
      const query = `
          INSERT INTO solicitacao (solicitacao_alimento, solicitacao_qtd, solicitacao_obs, solicitacao_entrega, solicitacao_data, solicitacao_horario)
          VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_solicitacao
      `;
      const values = [solicitacao_alimento, solicitacao_qtd, solicitacao_obs, solicitacao_entrega, solicitacao_data, solicitacao_horario];
      const result = await pool.query(query, values);

      // Apagar a doação correspondente à solicitação feita
      const deleteQuery = `
          DELETE FROM doacao
          WHERE id_doacao = (
              SELECT id_doacao
              FROM doacao
              WHERE doacao_alimento = $1
              AND doacao_qtd >= $2
              LIMIT 1
          );
      `;
      const deleteValues = [solicitacao_alimento, solicitacao_qtd];
      await pool.query(deleteQuery, deleteValues);

      res.send(`<script>alert('Solicitação cadastrada com sucesso! ID: ${result.rows[0].id_solicitacao}'); window.location.href = '/solicitar';</script>`);
  } catch (error) {
      console.error('Erro ao cadastrar a solicitação:', error.message);
      res.status(500).send(`<script>alert('Erro ao cadastrar a solicitação. Tente novamente.'); window.location.href = '/solicitar';</script>`);
  }
});

  module.exports = router;