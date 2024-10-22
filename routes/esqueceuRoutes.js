const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.get('/esqueceu', (req, res) => { // Rota protegida por autenticação
    res.render('esqueceu');  
  });

  module.exports = router;