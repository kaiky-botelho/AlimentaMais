function exibir() {
    let section = document.getElementById("resultados-pesquisa");
    section.innerHTML = ""; // Limpa resultados anteriores

    const opcoes = document.getElementsByName("entregaColeta");
    let resultadoSelecionado = "";

    for (let opcao of opcoes) {
        if (opcao.checked) {
            resultadoSelecionado = opcao.value; // Armazena o valor da opção selecionada
            break; // Sai do loop assim que encontrar a opção selecionada
        }
    }

    switch (resultadoSelecionado) {
        case "entrega":
            section.innerHTML = '<input type="text" id="endereco" name="endereco" required placeholder="Digite seu endereço">';
            break;
        case "retirar":
            section.innerHTML = "<p>Você selecionou a opção para retirar no endereço!</p>";
            break;
    }
}