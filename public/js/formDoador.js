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
const doadorDataNasc = document.querySelector("#doador_data_nasc");

form.addEventListener("submit", (event) => {
    // Impede o envio do formulário para validação
    event.preventDefault();
    
    let isValid = true;

    // Validação do Nome/Razão Social
    if (nomeDoador.value.trim() === "") {
        nomeDoador.classList.add("invalid");
        isValid = false;
    } else {
        nomeDoador.classList.remove("invalid");
    }

    // Validação do E-mail
    if (emailDoador.value.trim() === "") {
        emailDoador.classList.add("invalid");
        isValid = false;
    } else if (!validateEmail(emailDoador.value)) {
        emailDoador.classList.add("invalid");
        isValid = false;
    } else {
        emailDoador.classList.remove("invalid");
    }

    // Validação da Senha
    if (senhaDoador.value.trim() === "") {
        senhaDoador.classList.add("invalid");
        isValid = false;
    } else if (senhaDoador.value.length < 6) {
        senhaDoador.classList.add("invalid");
        isValid = false;
    } else {
        senhaDoador.classList.remove("invalid");
    }

    // Validação do Documento (CPF ou CNPJ)
    if (doadorDocumento.value.trim() === "") {
        doadorDocumento.classList.add("invalid");
        isValid = false;
    } else if (!validateDocumento(doadorDocumento.value)) {
        doadorDocumento.classList.add("invalid");
        isValid = false;
    } else {
        doadorDocumento.classList.remove("invalid");
    }

    // Validação da Idade (Maior de 18 anos)
    if (doadorDataNasc.value.trim() === "") {
        doadorDataNasc.classList.add("invalid");
        isValid = false;
    } else if (!validateIdade(doadorDataNasc.value)) {
        doadorDataNasc.classList.add("invalid");
        isValid = false;
    } else {
        doadorDataNasc.classList.remove("invalid");
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

function validateIdade(dataNasc) {
    const dataNascimento = new Date(dataNasc);
    const hoje = new Date();
    
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mes = hoje.getMonth() - dataNascimento.getMonth();
    
    // Se o mês atual for antes do mês de nascimento ou o mês for o mesmo, mas o dia for anterior
    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
    }

    // Verifica se a idade é maior ou igual a 18
    return idade >= 18;
}
