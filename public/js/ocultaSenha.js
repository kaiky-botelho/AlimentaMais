document.getElementById('toggle-password').addEventListener('click', function() {
    const passwordField = document.getElementById('senha');
    const eyeOpen = document.getElementById('eye-open');
    const eyeClosed = document.getElementById('eye-closed');
    
    if (passwordField.type === 'password') {
      passwordField.type = 'text'; // Altera o tipo do campo para "text"
      eyeOpen.style.display = 'block';  // Exibe o ícone de olho aberto
      eyeClosed.style.display = 'none'; // Esconde o ícone de olho fechado
    } else {
      passwordField.type = 'password'; // Altera o tipo do campo para "password"
      eyeOpen.style.display = 'none';  // Esconde o ícone de olho aberto
      eyeClosed.style.display = 'block'; // Exibe o ícone de olho fechado
    }
  });
  