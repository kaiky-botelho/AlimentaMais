const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.get('/beneficiario', (req, res) => {
    res.render('beneficiario');  
  });

  router.get('/beneficiarioHome', (req, res) => {
    res.render('beneficiarioHome');  
  });

  module.exports = router;