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

app.use(express.static('public'));

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000 ");
});