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

const form = document.querySelector("#form");
const nomeBeneficiario = document.querySelector("#nome");
const emailBeneficiario = document.querySelector("#benef_email");
const senhaBeneficiario = document.querySelector("#benef_senha");
const beneficiarioDocumento = document.querySelector("#benef_documento");
const benefDataNasc = document.querySelector("#benef_data_nasc");
const rendaFamiliar = document.querySelector("#rendaFamiliar");

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




        // Validação da Renda Familiar - Verifica se a renda é "Até 1 Salário Mínimo"
        if (rendaFamiliar.value !== "Até 1 Salário Mínimo") {
            rendaFamiliar.classList.add("invalid");
            rendaFamiliar.nextElementSibling.style.display = "block";
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
