function exibir() {
    let section = document.getElementById("resultados-radio");
    section.innerHTML = ""; // Limpa resultados anteriores

    const opcoes = document.getElementsByName("entregaColeta");
    let resultadoSelecionado = "";

    for (let opcao of opcoes) {
        if (opcao.checked) {
            resultadoSelecionado = opcao.value; 
            break; 
        }
    }

    switch (resultadoSelecionado) {
        case "entrega":
            section.innerHTML = '<div class="locais"><h2>Locais disponíveis para retirada</h2></div>';
            break;
        case "retirar":
            section.innerHTML = "<h3>A doação será retirada no seu Endereço!</h3>";
            break;
    }
}
