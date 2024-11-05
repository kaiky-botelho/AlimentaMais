function recoverPassword() {
    showLoading(); // Função que exibe um indicador de carregamento
    const email = document.getElementById('email').value; // Obtém o valor do e-mail
    firebase.auth().sendPasswordResetEmail(email).then(() => {
        hideLoading(); // Função que oculta o indicador de carregamento
        alert('Email enviado com sucesso'); // Alerta de sucesso
    }).catch(error => {
        hideLoading(); // Oculta o indicador de carregamento em caso de erro
        alert(getErrorMessage(error)); // Função que lida com erros
    });
}
