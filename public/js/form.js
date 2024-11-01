//buscar cep

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
            document.getElementById("endereco").value = data.logradouro;
            document.getElementById("bairro").value = data.bairro;
            document.getElementById("cidade").value = data.localidade;
            document.getElementById("uf").value = data.uf;
        })
        .catch(error => {
            console.log("Erro:", error);
        });
}

// Mascaras

$('#cep').mask('00000-000');
$('#cpf').mask('000.000.000-00', {reverse: true});
$('#telefone').mask('(00) 0000-0000');


//Validação dos campos



