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

$('#doador_cep').mask('00000-000');
$('#doador_documento').mask('000.000.000-00', {reverse: true});
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



