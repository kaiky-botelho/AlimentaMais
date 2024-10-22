const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.get('/cadastro', (req, res) => { // Rota protegida por autenticação
    res.render('cadastro');  
  });

  module.exports = router;