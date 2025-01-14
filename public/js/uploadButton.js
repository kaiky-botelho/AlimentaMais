document.getElementById("comprovantePDF").addEventListener("change", function () {
    const button = document.querySelector(".upload-btn");
    const buttonText = document.getElementById("button-text");
    const uploadIcon = document.getElementById("upload-icon");

    if (this.files.length > 0) {
        // Mudar o texto do botão para "Enviado"
        buttonText.textContent = "Comprovante Enviado"; // Mudando o texto do botão
        button.classList.add("success"); // Alterando o estilo do botão para verde

        // Trocar a imagem de upload pelo ícone de check
        uploadIcon.src = "/img/check.png"; // Caminho do ícone de check
        uploadIcon.alt = "Concluído"; // Mudando o alt da imagem

        // Ajustar o estilo do botão para ter o ícone ao lado do texto
        button.style.justifyContent = 'space-between'; // Deixar o ícone e o texto separados
    }
});
