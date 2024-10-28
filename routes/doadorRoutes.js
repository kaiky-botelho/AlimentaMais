const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.get('/doador', (req, res) => { 
    res.render('doador');  
  });

  router.get('/doadorHome', (req, res) => { 
    res.render('doadorHome');  
  });

  router.get('/fazerdoacao', (req, res) => { 
    res.render('fazerdoacao');  
  });

  module.exports = router;