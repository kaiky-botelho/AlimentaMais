# Projeto de Doação de Alimentos

Este é um sistema web desenvolvido para conectar **doadores** e **beneficiários** de alimentos. O objetivo do projeto é permitir que pessoas ou instituições que tenham alimentos disponíveis para doação possam registrar suas doações, enquanto beneficiários podem solicitar alimentos de acordo com suas necessidades. Além disso, o sistema possibilita a interação entre os usuários e a administração das solicitações, doações e usuários.

## Funcionalidades

- **Cadastro de Doador**: O doador pode se cadastrar no sistema, fornecendo dados pessoais como nome, CPF, telefone, email, endereço e dados relacionados à doação.
- **Cadastro de Beneficiário**: O beneficiário pode se cadastrar, incluindo informações sobre sua família, renda, e necessidades alimentares.
- **Doações**: O doador pode cadastrar alimentos disponíveis para doação, com detalhes sobre a quantidade, tipo de alimento, e observações.
- **Solicitações**: O beneficiário pode solicitar alimentos disponíveis para doação, detalhando a quantidade necessária e a forma de entrega ou retirada.
- **Notificações**: O sistema envia notificações para os doadores quando suas doações são solicitadas pelos beneficiários.
- **Administração**: Um administrador tem acesso a um painel de controle para gerenciar usuários (doadores e beneficiários), doações e solicitações.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript para backend.
- **Express.js**: Framework para desenvolvimento de aplicações web.
- **PostgreSQL**: Banco de dados relacional utilizado para armazenar informações dos usuários e transações.
- **EJS**: Template engine para renderizar as páginas HTML dinâmicas.
- **BCrypt**: Biblioteca para criptografar senhas de usuários.
- **JWT (JSON Web Tokens)**: Para autenticação de usuários no sistema.
- **Multer**: Middleware para upload de arquivos (caso necessário no futuro).
- **Date-fns**: Utilitário para manipulação de datas.

## Estrutura do Projeto

