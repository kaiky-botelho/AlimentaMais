const express = require('express');
const bodyParser = require('body-parser');
const loginRoutes = require('./routes/loginRoutes');
const doadorRoutes = require('./routes/doadorRoutes');
const beneficiarioRoutes = require('./routes/beneficiarioRoutes');

const app = express();

// Configuração do body-parser para tratar dados do formulário
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração de arquivos estáticos
app.use(express.static('public'));
app.use(express.static('models'));

// Configuração de visualização
app.set('view engine', 'ejs');

// Configuração das rotas com caminhos específicos
app.use('/login', loginRoutes);
app.use('/doador', doadorRoutes);
app.use('/beneficiario', beneficiarioRoutes);

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
