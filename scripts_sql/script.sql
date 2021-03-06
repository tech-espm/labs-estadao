CREATE DATABASE IF NOT EXISTS estadao;
USE estadao;

CREATE TABLE perfil (
	id int NOT NULL AUTO_INCREMENT,
	nome varchar(50) NOT NULL,
	PRIMARY KEY (id),
	UNIQUE KEY nome_UN (nome)
);

INSERT INTO perfil (nome) VALUES ('ADMINISTRADOR'), ('COMUM');

CREATE TABLE usuario (
	id int NOT NULL AUTO_INCREMENT,
	login varchar(100) NOT NULL,
	nome varchar(100) NOT NULL,
	idperfil int NOT NULL,
	senha varchar(100) NOT NULL,
	token char(32) DEFAULT NULL,
	PRIMARY KEY (id),
	UNIQUE KEY login_UN (login),
	KEY idperfil_FK_idx (idperfil),
	CONSTRAINT idperfil_FK FOREIGN KEY (idperfil) REFERENCES perfil (id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

INSERT INTO usuario (login, nome, idperfil, senha, token) VALUES ('ADMIN', 'ADMINISTRADOR', 1, 'peTcC99vkvvLqGQL7mdhGuJZIvL2iMEqvCNvZw3475PJ:JVyo1Pg2HyDyw9aSOd3gNPT30KdEyiUYCjs7RUzSoYGN', NULL);

-- Tabela Tipos de quiz 
CREATE TABLE tipo (
	tipo_id INT NOT NULL,
	tipo_nome VARCHAR(50) NOT NULL,
	tipo_desc VARCHAR(250) NOT NULL,
	-- PK, FK & UK
	PRIMARY KEY (tipo_id),
	UNIQUE KEY tipo_nome_UN (tipo_nome)
);

INSERT INTO tipo (tipo_id, tipo_nome, tipo_desc) VALUES
(1, 'Pontuação', 'O resultado do quiz depende da quantidade de perguntas respondidas corretamente');
-- (2, 'Perfil', 'O resultado do quiz depende das respostas dadas às perguntas');

-- Tabela Quiz 
CREATE TABLE quiz (
	quiz_id INT NOT NULL AUTO_INCREMENT,
	quiz_nome VARCHAR(100) NOT NULL,
	quiz_nome_normalizado VARCHAR(100) NOT NULL,
	quiz_desc VARCHAR(500) NOT NULL,
	quiz_style VARCHAR(1000) NOT NULL,
	quiz_script VARCHAR(1000) NOT NULL,
	quiz_img INT NOT NULL,
	quiz_data_cria TIMESTAMP NOT NULL DEFAULT NOW(),
	quiz_data_mod TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
	id_tipo INT NOT NULL,
	-- PK, FK & UK
	PRIMARY KEY (quiz_id),
	UNIQUE KEY quiz_nome_UN (quiz_nome),
	UNIQUE KEY quiz_nome_normalizado_UN (quiz_nome_normalizado),
	KEY id_tipo_FK_idx (id_tipo),
	CONSTRAINT id_tipo_FK FOREIGN KEY (id_tipo) REFERENCES tipo (tipo_id)
);

-- Tabela Perguntas 
CREATE TABLE pergunta (
	perg_id INT NOT NULL AUTO_INCREMENT,
	perg_titulo VARCHAR(100) NOT NULL,
	perg_texto VARCHAR(500) NOT NULL,
	perg_img INT NOT NULL,
	perg_pontuacao INT NOT NULL,
	perg_resp_texto VARCHAR(500) NOT NULL,
	perg_resp_img INT NOT NULL,
	quiz_id INT NOT NULL,
	-- PK, FK & UK
	PRIMARY KEY (perg_id),
	KEY quiz_id_FK_idx (quiz_id),
	CONSTRAINT quiz_id_FK FOREIGN KEY (quiz_id) REFERENCES quiz (quiz_id)
);

-- Tabela Alternativas
CREATE TABLE alternativa (
	alt_id INT NOT NULL AUTO_INCREMENT,
	alt_texto VARCHAR(500) NOT NULL,
	alt_img INT NOT NULL,
	alt_correta TINYINT(1) NOT NULL,
	perg_id INT NOT NULL,
	-- PK, FK & UK
	PRIMARY KEY (alt_id),
	KEY perg_id_FK_idx (perg_id),
	CONSTRAINT perg_id_FK FOREIGN KEY (perg_id) REFERENCES pergunta (perg_id)
);


-- Add column on Quiz Table --> timer
ALTER TABLE `estadao`.`quiz` 
	ADD COLUMN `quiz_timer` TINYINT(1) NOT NULL AFTER `quiz_data_mod`;
