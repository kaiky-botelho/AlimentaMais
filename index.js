const express = require('express');
const bodyParser = require('body-parser');

const app = express ();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('login')
});

app.get('/cadastro', (req, res) => {
    res.render('cadastro')
});

app.get('/doador', (req, res) => {
    res.render('doador')
});

app.get('/voluntario', (req, res) => {
    res.render('voluntario')
});

app.get('/beneficiario', (req, res) => {
    res.render('beneficiario')
});

app.use(express.static('public'));

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000 ");
});