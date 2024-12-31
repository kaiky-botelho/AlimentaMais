const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { format } = require('date-fns');
const { ptBR } = require('date-fns/locale');
const pool = require('../config/database');


router.get('/admimHome', (req, res) => {
    res.render('admimHome');
});




module.exports = router;