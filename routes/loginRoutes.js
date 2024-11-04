const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Para a comparação de senhas
const { Pool } = require('pg'); // Para conexão com PostgreSQL

router.use(bodyParser.urlencoded({ extended: true }));

// Rota para a páginas de logins e inicial
router.get('/', (req, res) => {
    res.render('inicial');  
});

router.get('/loginBenf', (req, res) => {
    res.render('loginBenf');  
});

router.get('/loginDoador', (req, res) => {
    res.render('loginDoador');  
});


  module.exports = router;
