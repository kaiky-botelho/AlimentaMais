document.addEventListener('DOMContentLoaded', function() {
    const proximoBtn = document.getElementById('proximo');
    const voltarBtn = document.getElementById('voltar');
    const container = document.querySelector('.container');
    
    // Evento para mover o container para a direita
    proximoBtn.addEventListener('click', function() {
        container.classList.add('mover-direita');
        container.classList.remove('mover-esquerda');
    });

    // Evento para mover o container de volta para a esquerda
    voltarBtn.addEventListener('click', function() {
        container.classList.add('mover-esquerda');
        container.classList.remove('mover-direita');
    });
});
