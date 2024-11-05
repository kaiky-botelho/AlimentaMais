const express = require('express');
const bodyParser = require('body-parser');
const loginRoutes = require('./routes/loginRoutes');
const esqueceuRoutes = require('./routes/esqueceuRoutes');
const doadorRoutes = require('./routes/doadorRoutes');
const beneficiarioRoutes = require('./routes/beneficiarioRoutes');

const app = express();

// Configuração do body-parser para tratar dados do formulário
app.use(bodyParser.json()); // Para analisar JSON
app.use(bodyParser.urlencoded({ extended: true })); // Para analisar dados de formulário URL-encoded

// Configuração de arquivos estáticos
app.use(express.static('public'));

// Configuração de visualização
app.set('view engine', 'ejs');

// Configuração das rotas
app.use('/', loginRoutes);
app.use('/', esqueceuRoutes);
app.use('/', doadorRoutes);
app.use('/', beneficiarioRoutes);

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
