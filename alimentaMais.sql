CREATE TABLE cadastro_doador (
	id_doador SERIAL NOT NULL PRIMARY KEY,
	nome_razao VARCHAR(200),
  	doador_documento VARCHAR(14) NOT NULL UNIQUE,
	doador_telefone VARCHAR(20),
	doador_data_nasc DATE,
	doador_email VARCHAR(100),
	doador_senha VARCHAR(60),
	doador_cep VARCHAR(10),
	doador_cidade VARCHAR(100),
	doador_UF CHAR(2),
	doador_endereco VARCHAR(100),
	doador_numero VARCHAR(5),
	doador_bairro VARCHAR(100),
	doador_complemento VARCHAR(100),
	frequencia_doacao VARCHAR(10)
);

SELECT * FROM cadastro_doador;

CREATE TABLE cadastro_beneficiario (
	id_beneficiario SERIAL NOT NULL PRIMARY KEY,
	nome VARCHAR(200),
    benef_documento VARCHAR(20) NOT NULL UNIQUE,
	benef_telefone VARCHAR(20),
	benef_data_nasc DATE,
	benef_email VARCHAR(100),
	benef_senha VARCHAR(60),
	benef_cep VARCHAR(10),
	benef_cidade VARCHAR(100),
	benef_UF CHAR(2),
	benef_endereco VARCHAR(100),
	benef_numero VARCHAR(5),
	benef_bairro VARCHAR(100),
	benef_complemento VARCHAR(100),
	renda VARCHAR(50)
);

SELECT * FROM cadastro_beneficiario;

CREATE TABLE solicitacao (
	id_solicitacao SERIAL NOT NULL PRIMARY KEY,
	solicitacao_alimento VARCHAR(100),
	solicitacao_qtd VARCHAR(50),
	solicitacao_obs VARCHAR(100),
	solicitacao_entrega VARCHAR(50) CHECK (solicitacao_entrega IN ('Entregar pessoalmente', 'Retirar no endereço')), 
	solicitacao_data DATE,
	solicitacao_horario VARCHAR(5),
	id_beneficiario INTEGER,  -- Adicionando a coluna para chave estrangeira
	FOREIGN KEY (id_beneficiario) REFERENCES cadastro_beneficiario(id_beneficiario)  -- Referência correta para chave estrangeira
);

SELECT * FROM solicitacao;

CREATE TABLE doacao (
	id_doacao SERIAL NOT NULL PRIMARY KEY,
	doacao_alimento VARCHAR(100),
	doacao_qtd VARCHAR(50),
	doacao_obs VARCHAR(100),
	doacao_horario VARCHAR(5),
	id_doador INTEGER,  -- Adicionando a coluna para chave estrangeira
	FOREIGN KEY (id_doador) REFERENCES cadastro_doador(id_doador)  -- Referência correta para chave estrangeira
);

SELECT * FROM doacao;

