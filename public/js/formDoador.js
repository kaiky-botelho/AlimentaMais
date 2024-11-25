//buscar cep dodador
function buscarCep(cep) {
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

$(document).ready(function() {
    $('#doador_documento').on('input', function() {
        const documento = $(this).val().replace(/\D/g, ''); // Remove qualquer caractere não numérico
        const tamanho = documento.length;

        // Remove qualquer máscara antes de aplicar a nova
        $(this).unmask();

        // Aplica a máscara apropriada
        if (tamanho > 11) {
            $(this).mask('00.000.000/0000-00', {reverse: true}); // CNPJ
        } else if (tamanho > 0) {
            $(this).mask('000.000.000-00', {reverse: true}); // CPF
        }
    });
});



$('#doador_cep').mask('00000-000');
$('#doador_telefone').mask('(00) 0 0000-0000');

//Validação Formulario

const form = document.querySelector("#form");
const nomeDoador = document.querySelector("#nome_razao");
const emailDoador = document.querySelector("#doador_email");
const senhaDoador = document.querySelector("#doador_senha");
const doadorDocumento = document.querySelector("#doador_documento");

form.addEventListener("submit", (event) => {
    // Impede o envio do formulário para validação
    event.preventDefault();
    
    let isValid = true;

    // Validação do Nome/Razão Social
    if (nomeDoador.value.trim() === "") {
        alert("O campo Nome/Razão Social é obrigatório.");
        isValid = false;
    }

    // Validação do E-mail
    if (emailDoador.value.trim() === "") {
        alert("O campo E-mail é obrigatório.");
        isValid = false;
    } else if (!validateEmail(emailDoador.value)) {
        alert("Por favor, insira um endereço de e-mail válido.");
        isValid = false;
    }

    // Validação da Senha
    if (senhaDoador.value.trim() === "") {
        alert("O campo Senha é obrigatório.");
        isValid = false;
    } else if (senhaDoador.value.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        isValid = false;
    }

    // Validação do Documento (CPF ou CNPJ)
    if (doadorDocumento.value.trim() === "") {
        alert("O campo Documento é obrigatório.");
        isValid = false;
    } else if (!validateDocumento(doadorDocumento.value)) {
        alert("Por favor, insira um CPF ou CNPJ válido.");
        isValid = false;
    }

    // Envia o formulário se tudo estiver válido
    if (isValid) {
        form.submit();
    }
});

// Função para validar o formato do e-mail
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Função para validar o documento (CPF ou CNPJ)
function validateDocumento(documento) {
    // Regex para CPF (11 dígitos numéricos)
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    // Regex para CNPJ (14 dígitos numéricos)
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    
    // Verifica se o documento corresponde a CPF ou CNPJ
    return cpfRegex.test(documento) || cnpjRegex.test(documento);
}
