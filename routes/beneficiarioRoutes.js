const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.get('/beneficiario', (req, res) => { // Rota protegida por autenticação
    res.render('beneficiario');  
  });


  module.exports = router;