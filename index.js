const express = require('express');
const bodyParser = require('body-parser');
const loginRoutes = require ('./routes/loginRoutes');
const esqueceuRoutes = require ('./routes/esqueceuRoutes');
const cadastroRoutes = require ('./routes/cadastroRoutes');
const doadorRoutes = require ('./routes/doadorRoutes');
const doadorHome = require ('./routes/doadorRoutes');
const beneficiarioRoutes = require ('./routes/beneficiarioRoutes');

const app = express ();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(loginRoutes);
app.use(esqueceuRoutes);
app.use(cadastroRoutes);
app.use(doadorRoutes);
app.use(doadorHome);
app.use(beneficiarioRoutes);

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000 ");
});