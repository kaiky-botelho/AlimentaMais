const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.get('/', (req, res) => { // Rota protegida por autenticação
    res.render('login');  
  });

  module.exports = router;