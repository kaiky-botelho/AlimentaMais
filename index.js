const express = require('express');
const bodyParser = require('body-parser');
const loginRoutes = require('./routes/loginRoutes');
const esqueceuRoutes = require('./routes/esqueceuRoutes');
const doadorRoutes = require('./routes/doadorRoutes');
const beneficiarioRoutes = require('./routes/beneficiarioRoutes');

const app = express();

// Configuração do body-parser para tratar dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Configuração de arquivos estáticos
app.use(express.static('public'));

// Configuração das rotas
app.use(loginRoutes);
app.use(esqueceuRoutes);
app.use(doadorRoutes);
app.use(beneficiarioRoutes);

// Inicia o servidor
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
