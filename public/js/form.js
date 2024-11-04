//buscar cep dodador

function buscaCep(cep) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => {
            if (!response.ok) {
                console.log("Erro de conexão");
                return;
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            document.getElementById("doador_endereco").value = data.logradouro;
            document.getElementById("doador_bairro").value = data.bairro;
            document.getElementById("doador_cidade").value = data.localidade;
            document.getElementById("doador_UF").value = data.uf;
        })
        .catch(error => {
            console.log("Erro:", error);
        });
}


// Mascaras doador

const documento = document.getElementById('doador_documento').value;

const doador_documento = documento.length;

if (doador_documento === 11) {
    $('#doador_documento').mask('000.000.000-00', {reverse: true});
} else if (doador_documento === 14) {
    $('#doador_documento').mask('00.000.000/0000-00', {reverse: true}); 
}

$('#doador_cep').mask('00000-000');
$('#doador_telefone').mask('(00) 0 0000-0000');

//buscar cep beneficiario

function buscaCep(cep) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => {
            if (!response.ok) {
                console.log("Erro de conexão");
                return;
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            document.getElementById("benef_endereco").value = data.logradouro;
            document.getElementById("benef_bairro").value = data.bairro;
            document.getElementById("benef_cidade").value = data.localidade;
            document.getElementById("benef_UF").value = data.uf;
        })
        .catch(error => {
            console.log("Erro:", error);
        });
}

// Mascaras beneficiario

$('#benef_cep').mask('00000-000');
$('#benef_documento').mask('000.000.000-00', {reverse: true});
$('#benef_telefone').mask('(00) 0 0000-0000');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submit', (req, res) => {
    const selectedOptions = req.body.options; // Isso pode ser um array ou uma string
    if (!selectedOptions) {
        return res.send('Nenhuma opção selecionada');
    }

    // Se apenas uma opção for selecionada, selectedOptions será uma string
    // Se várias opções forem selecionadas, será um array
    const optionsToSave = Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions];

    // Aqui você deve salvar as opções no banco de dados
    // Exemplo usando PostgreSQL:
    const query = 'INSERT INTO sua_tabela (coluna) VALUES ($1)';
    optionsToSave.forEach(option => {
        // Executar a inserção para cada opção
        // db.query é uma função que você deve definir para se conectar ao PostgreSQL
        db.query(query, [option], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao salvar no banco');
            }
        });
    });

    res.send('Opções salvas com sucesso!');
});

