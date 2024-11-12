function exibir() {
    var entregar = document.getElementById("entregar-pessoalmente").checked;
    var locais = document.querySelector(".locais");
    var entregaEndereco = document.getElementById("entrega-endereco");

    // Se "Entregar no meu endereço" for selecionado
    if (entregar) {
        locais.style.display = "none"; // Esconde os locais
        entregaEndereco.style.display = "block"; // Exibe a mensagem de entrega no endereço
    } else {
        locais.style.display = "block"; // Exibe os locais
        entregaEndereco.style.display = "none"; // Esconde a mensagem de entrega no endereço
    }
}
