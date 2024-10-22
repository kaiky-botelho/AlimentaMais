const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.get('/voluntario', (req, res) => { // Rota protegida por autenticação
    res.render('voluntario');  
  });

  module.exports = router;