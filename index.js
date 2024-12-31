const express = require('express');
const bodyParser = require('body-parser');
const loginRoutes = require('./routes/loginRoutes');
const doadorRoutes = require('./routes/doadorRoutes');
const beneficiarioRoutes = require('./routes/beneficiarioRoutes');
const administradorRoutes = require('./routes/administradorRoutes.js');

const app = express();

// Configuração do body-parser para tratar dados do formulário
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração de arquivos estáticos
app.use(express.static('public'));
app.use(express.static('models'));

// Configuração de visualização
app.set('view engine', 'ejs');

// Configuração das rotas
app.use('/', loginRoutes);
app.use('/', doadorRoutes);
app.use('/', beneficiarioRoutes);
app.use('/', administradorRoutes);

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});