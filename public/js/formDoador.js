document.getElementById('button').addEventListener('click', function () {
    const imgContainer = document.querySelector('.img-container');
    imgContainer.classList.add('mover');
    imgContainer.classList.remove('voltar');
});

document.getElementById('button-voltar').addEventListener('click', function () {
    const imgContainer = document.querySelector('.img-container');
    imgContainer.classList.add('voltar');
    imgContainer.classList.remove('mover');
});


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

/*$(document).ready(function() {
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
});*/


$('#doador_documento').mask('000.000.000-00')
$('#doador_cep').mask('00000-000');
$('#doador_telefone').mask('(00) 0 0000-0000');

//Validação Formulario

const form = document.querySelector("#form");
const nomeBeneficiario = document.querySelector("#nome_razao");
const emailBeneficiario = document.querySelector("#doador_email");
const senhaBeneficiario = document.querySelector("#doador_senha");
const beneficiarioDocumento = document.querySelector("#doador_documento");
const benefDataNasc = document.querySelector("#doador_data_nasc");

form.addEventListener("submit", (event) => {
    // Impede o envio do formulário para validação
    event.preventDefault();
    
    let isValid = true;

    // Validação do Nome/Razão Social
    if (nomeBeneficiario.value.trim() === "") {
        nomeBeneficiario.classList.add("invalid");
        nomeBeneficiario.nextElementSibling.style.display = "block";  // Exibe o span
        isValid = false;
    } else {
        nomeBeneficiario.classList.remove("invalid");
        nomeBeneficiario.nextElementSibling.style.display = "none";  // Oculta o span
    }

    // Validação do E-mail
    if (emailBeneficiario.value.trim() === "") {
        emailBeneficiario.classList.add("invalid");
        emailBeneficiario.nextElementSibling.style.display = "block";  // Exibe o span
        isValid = false;
    } else if (!validateEmail(emailBeneficiario.value)) {
        emailBeneficiario.classList.add("invalid");
        emailBeneficiario.nextElementSibling.style.display = "block";  // Exibe o span
        isValid = false;
    } else {
        emailBeneficiario.classList.remove("invalid");
        emailBeneficiario.nextElementSibling.style.display = "none";  // Oculta o span
    }

    // Validação da Senha
    if (senhaBeneficiario.value.trim() === "") {
        senhaBeneficiario.classList.add("invalid");
        senhaBeneficiario.nextElementSibling.style.display = "block";  // Exibe o span
        isValid = false;
    } else if (senhaBeneficiario.value.length < 6) {
        senhaBeneficiario.classList.add("invalid");
        senhaBeneficiario.nextElementSibling.style.display = "block";  // Exibe o span
        isValid = false;
    } else {
        senhaBeneficiario.classList.remove("invalid");
        senhaBeneficiario.nextElementSibling.style.display = "none";  // Oculta o span
    }

    // Validação do Documento (CPF ou CNPJ)
    if (beneficiarioDocumento.value.trim() === "") {
        beneficiarioDocumento.classList.add("invalid");
        beneficiarioDocumento.nextElementSibling.style.display = "block";  // Exibe o span
        isValid = false;
    } else if (!validateDocumento(beneficiarioDocumento.value)) {
        beneficiarioDocumento.classList.add("invalid");
        beneficiarioDocumento.nextElementSibling.style.display = "block";  // Exibe o span
        isValid = false;
    } else {
        beneficiarioDocumento.classList.remove("invalid");
        beneficiarioDocumento.nextElementSibling.style.display = "none";  // Oculta o span
    }

    // Validação da Idade (Maior de 18 anos)
    if (benefDataNasc.value.trim() === "") {
        benefDataNasc.classList.add("invalid");
        benefDataNasc.nextElementSibling.style.display = "block";  // Exibe o span
        isValid = false;
    } else if (!validateIdade(benefDataNasc.value)) {
        benefDataNasc.classList.add("invalid");
        benefDataNasc.nextElementSibling.style.display = "block";  // Exibe o span
        isValid = false;
    } else {
        benefDataNasc.classList.remove("invalid");
        benefDataNasc.nextElementSibling.style.display = "none";  // Oculta o span
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

//Ocultar - Mostrar senha
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('doador_senha');
    const togglePassword = document.getElementById('togglePassword');
    const eyeIcon = document.getElementById('eyeIcon');

    togglePassword.addEventListener('click', () => {
        // Alterna o tipo de input entre 'password' e 'text'
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Alterna o ícone
        eyeIcon.classList.toggle('fa-eye');
        eyeIcon.classList.toggle('fa-eye-slash');
    });
});