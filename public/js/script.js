// Obtém a data atual no formato YYYY-MM-DD
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
const dd = String(today.getDate()).padStart(2, '0');
const minDate = `${yyyy}-${mm}-${dd}`;

// Define a data mínima no campo de data
const dateInput = document.getElementById('doacao_data');
if (dateInput) {
    dateInput.min = minDate;
}
