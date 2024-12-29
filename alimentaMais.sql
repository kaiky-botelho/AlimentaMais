-- Tabela para cadastro de doadores
CREATE TABLE cadastro_doador (
    id_doador SERIAL NOT NULL PRIMARY KEY,
    nome_razao VARCHAR(200),
    documento VARCHAR(14) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    data_nascimento DATE,
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(60),
    cep VARCHAR(20),
    cidade VARCHAR(100),
    uf CHAR(2),
    endereco VARCHAR(100),
    numero VARCHAR(5),
    bairro VARCHAR(100),
    complemento VARCHAR(100)
);

-- Tabela para cadastro de beneficiários
CREATE TABLE cadastro_beneficiario (
    id_beneficiario SERIAL NOT NULL PRIMARY KEY,
    nome VARCHAR(200),
    documento VARCHAR(20) NOT NULL UNIQUE,
    telefone VARCHAR(20) UNIQUE,
    data_nascimento DATE,
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(60),
    cep VARCHAR(10),
    cidade VARCHAR(100),
    uf CHAR(2),
    endereco VARCHAR(100),
    numero VARCHAR(5),
    bairro VARCHAR(100),
    complemento VARCHAR(100),
    qtd_familiares INT CHECK (qtd_familiares > 0),
    renda NUMERIC(10, 2) CHECK (renda >= 0),
    status_aprovacao VARCHAR(20) DEFAULT 'Pendente' CHECK (status_aprovacao IN ('Pendente', 'Aprovado', 'Rejeitado')),
    comprovante_renda_pdf VARCHAR(255) -- Armazena o caminho do arquivo PDF
);

-- Tabela para cadastro de administradores
CREATE TABLE administrador (
    id_administrador SERIAL PRIMARY KEY,
    nome VARCHAR(200),
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(60) NOT NULL
);

-- Tabela para doações
CREATE TABLE doacao (
    id_doacao SERIAL NOT NULL PRIMARY KEY,
    alimento VARCHAR(100),
    quantidade VARCHAR(50),
    observacao VARCHAR(100),
    horario TIME,
    data DATE,
    endereco_retirada VARCHAR(100),
    id_doador INTEGER NOT NULL,
    FOREIGN KEY (id_doador) REFERENCES cadastro_doador(id_doador)
);

-- Tabela para solicitações
CREATE TABLE solicitacao (
    id_solicitacao SERIAL NOT NULL PRIMARY KEY,
    alimento VARCHAR(100),
    quantidade VARCHAR(50),
    observacao VARCHAR(100),
    tipo_entrega VARCHAR(50) CHECK (tipo_entrega IN ('Entregar pessoalmente', 'Retirar no endereço')),
    data DATE,
    horario TIME,
    endereco_retirada VARCHAR(100),
    id_beneficiario INTEGER NOT NULL,
    id_doacao INTEGER,
    FOREIGN KEY (id_beneficiario) REFERENCES cadastro_beneficiario(id_beneficiario),
    FOREIGN KEY (id_doacao) REFERENCES doacao(id_doacao)
);

-- Tabela para notificações
CREATE TABLE notificacao (
    id_notificacao SERIAL PRIMARY KEY,
    id_doador INTEGER REFERENCES cadastro_doador(id_doador),
    id_solicitacao INTEGER REFERENCES solicitacao(id_solicitacao),
    texto TEXT,
    lida BOOLEAN DEFAULT FALSE
);
