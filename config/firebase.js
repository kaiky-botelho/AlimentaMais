// Importa apenas as funções necessárias para o Node.js
const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");

// Configuração do Firebase (com as informações fornecidas)
const firebaseConfig = {
  apiKey: "AIzaSyDMvQUFBo8xoLTbWfZ5fB7coZEuacOCoQg",
  authDomain: "alimentamais-d324b.firebaseapp.com",
  projectId: "alimentamais-d324b",
  storageBucket: "alimentamais-d324b.appspot.com",
  messagingSenderId: "619934536395",
  appId: "1:619934536395:web:44dcbc381508d7d480814e",
  measurementId: "G-GL3XHFZNSV" // Este é opcional para Node.js
};

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig);

// Configura o Firebase Authentication
const auth = getAuth(app);

// Exporta a instância do auth para ser usada em outros arquivos
module.exports = { auth };
