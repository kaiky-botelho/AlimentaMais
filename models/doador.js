document.getElementById('profile').addEventListener('click', function() {
    const perfil = document.getElementById('perfil');
    perfil.classList.toggle('aparecer'); 
});

function mostrar(acao) {
    let section = document.getElementById('resultado-mostrar');

    if (acao === 'editar') {
        section.style.display = 'flex';
        section.innerHTML = `
            <div class="informacao-section" id="informacao-section">
                <form action="" method="post">
                    <div class="form">
                        <h4>Editar Informações</h4>
                        <div class="form-input">
                            <input type="text" name="nome_razao" id="nome_razao" placeholder="Nome">
                        </div>
                        <div class="form-input">
                            <input type="email" name="doador_email" id="doador_email" placeholder="Email">
                        </div>
                        <div class="form-input">
                            <input type="text" name="doador_endereco" id="doador_endereco" placeholder="Endereço">
                        </div>
                        <div class="form-input">
                            <div class="form-input-inner">
                                <input type="text" name="doador_cidade" id="doador_cidade" placeholder="Cidade">
                                <input type="text" name="doador_UF" id="doador_UF" placeholder="UF">
                            </div>
                        </div>
                        <div class="form-input">
                            <div class="form-input-inner">
                                <input type="text" name="doador_bairro" id="doador_bairro" placeholder="Bairro">
                                <input type="text" name="doador_cep" id="doador_cep" placeholder="CEP">
                            </div>
                        </div>
                        <button><img src="/img/atualizar.svg" alt="">Atualizar</button>
                    </div>
                </form>
            </div>
        `;

        document.getElementById('informacao-section').addEventListener('click', function() {
            section.style.display = 'none';  
        });

    } else if (acao === 'deletar') {
        section.style.display = 'flex';

        section.innerHTML = `        
        <div class="informacao-section" id="informacao-section">
        <div class="deletar-confirmacao">
            <h4>DELETAR SUA CONTA</h4>
            <p>Sua conta será deletada definitivamente</p>
            <p>Deseja continuar?</p>
            <button><img src="/img/trash.svg" alt="" srcset="">DELETAR</button>
        </div>`;

        document.getElementById('informacao-section').addEventListener('click', function() {
        section.style.display = 'none'; });
    }
}
