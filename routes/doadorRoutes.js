const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.get('/doador', (req, res) => { // Rota protegida por autenticação
    res.render('doador');  
  });

  module.exports = router;