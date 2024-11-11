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
$(document).ready(function() {
    $('#doador_documento').mask('000.000.000-00', {reverse: true}); // Aplica a máscara padrão para CPF inicialmente

    $('#doador_documento').on('input', function() {
        const documento = $(this).val();
        const doador_documento = documento.length;

        // Verifica o comprimento do documento e aplica a máscara apropriada
        if (doador_documento > 11) {
            $(this).mask('00.000.000/0000-00', {reverse: true}); // Aplica a máscara para CNPJ
        } else {
            $(this).mask('000.000.000-00', {reverse: true}); // Retorna para a máscara de CPF
        }
    });
});


$('#doador_cep').mask('00000-000');
$('#doador_telefone').mask('(00) 0 0000-0000');

