// IMPORTS
// Express
import express = require("express");

// SQL
import Sql = require("../../infra/sql");

// Env variables
import appsettings = require("../../appsettings");

// Models
import Armazenamento = require("./armazenamento");
import Alternativa = require("./alternativa");
import Quiz = require("./quiz");

// File Upload
import FS = require("../../infra/fs");
import Upload = require("../../infra/upload");

export = class Pergunta {
	// Setting the fields para a classe Pergunta
	public perg_id: number;
	public perg_titulo: string; // form
	public perg_texto: string; // form
	public perg_img: number; // form
	public perg_pontuacao: number; // form or default 1 ?
	public perg_resp_texto: string; // Form
	public perg_resp_img: number; // Form
	public quiz_id: number;
	public alternativas: Alternativa[];

	public static async listar(quiz_id: number): Promise<Pergunta[]> {
		let lista: Pergunta[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = (await sql.query(
				"SELECT perg_id, perg_titulo, perg_texto, perg_img, perg_pontuacao, perg_resp_texto, perg_resp_img, quiz_id FROM pergunta WHERE quiz_id = ?",
				[quiz_id]
			)) as Pergunta[];
		});

		return lista || [];
	}

	public static async obter(quiz_id: number, perg_id: number): Promise<Pergunta> {
		let item: Pergunta = null;

		await Sql.conectar(async (sql: Sql) => {
			const lista = (await sql.query(
				"SELECT perg_id, perg_titulo, perg_texto, perg_img, perg_pontuacao, perg_resp_texto, perg_resp_img, quiz_id FROM pergunta WHERE quiz_id = ? AND perg_id = ?",
				[quiz_id, perg_id]
			)) as Pergunta[];

			if (lista && lista.length) {
				item = lista[0];
				item.alternativas = (await sql.query(
					"SELECT alt_id, alt_texto, alt_img, alt_correta, perg_id FROM alternativa WHERE perg_id = ?",
					[item.perg_id]
				)) as Alternativa[];
			}
		});

		return item;
	}

	// Funcao para salvar a questao
	public static async criar(p: Pergunta): Promise<string> {
		let res: string = null;

		await Sql.conectar(async (sql: Sql) => {
            await sql.beginTransaction();

            // Inserting the question the DB
            await sql.query(
                "INSERT INTO pergunta (perg_titulo, perg_texto, perg_img, perg_pontuacao, perg_resp_texto, perg_resp_img, quiz_id) VALUES (?, ?, 0, ?, ?, 0, ?)",
                [p.perg_titulo, p.perg_texto, p.perg_pontuacao, p.perg_resp_texto, p.quiz_id]
            );

            // Getting the ID
            p.perg_id = (await sql.scalar("SELECT LAST_INSERT_ID()")) as number;

            // Salvando as alternativas
            if (p.alternativas) {
                for (let i = 0; i < p.alternativas.length; i++) {
                    p.alternativas[i].perg_id = p.perg_id;
                    await Alternativa.criar(sql, p.alternativas[i]);
                }
            }

            await Armazenamento.criarPastaPergunta(p.quiz_id, p.perg_id);

            await sql.commit();
		});

		return res;
	}

	// Funcao para Editar/Atualizar a questao
	public static async editar(p: Pergunta): Promise<string> {
		let res: string = null;

		await Sql.conectar(async (sql: Sql) => {
            await sql.beginTransaction();

            // Inserting the question the DB
            await sql.query(
                "UPDATE pergunta SET perg_titulo = ?, perg_texto = ?, perg_pontuacao = ?, perg_resp_texto = ? WHERE perg_id = ?",
                [p.perg_titulo, p.perg_texto, p.perg_pontuacao, p.perg_resp_texto, p.perg_id]
            );

            const alternativasExistentes = await sql.query(
                "SELECT alt_id FROM alternativa WHERE perg_id = ?",
                [p.perg_id]
            ) as Alternativa[];

            if (!p.alternativas) {
                p.alternativas = new Array();
            }

            const alternativasNovas = p.alternativas.slice();

            // Busca as alterativas existentes para atualizar
            for (let e = 0; e < alternativasExistentes.length; e++) {
                const alt_id_existente = alternativasExistentes[e].alt_id;

                for (let n = 0; n < alternativasNovas.length; n++) {
                    if (alt_id_existente === alternativasNovas[n].alt_id) {
                        alternativasNovas[n].perg_id = p.perg_id;
                        await Alternativa.editar(sql, alternativasNovas[n]);
                        alternativasExistentes.splice(e, 1);
                        e--;
                        alternativasNovas.splice(n, 1);
                        break;
                    }
                }
            }

            // Exclui as alternativas antigas que não vieram no array novo
            for (let e = 0; e < alternativasExistentes.length; e++) {
                await Alternativa.excluir(sql, p.quiz_id, p.perg_id, alternativasExistentes[e].alt_id);
            }

            // Salvando as alternativas
            for (let i = 0; i < alternativasNovas.length; i++) {
                alternativasNovas[i].perg_id = p.perg_id;
                await Alternativa.criar(sql, alternativasNovas[i]);
            }

            await sql.commit();
		});

		return res;
	}

	// Funcao para Deletar a questao
	public static async excluir(quiz_id: number, perg_id: number): Promise<void> {
        
		await Sql.conectar(async (sql: Sql) => {
            await sql.query("DELETE FROM pergunta WHERE quiz_id = ? AND perg_id = ?", [quiz_id, perg_id]);

            if (sql.linhasAfetadas) {
                try {
                    await Armazenamento.excluirPastaPergunta(quiz_id, perg_id);
                } catch (ex) {
                    // Apenas ignora, por hora...
                }
            }
		});

    }

	public static async incrementarVersaoImagem(quiz_id: number, perg_id: number): Promise<number> {
        let res = 0;

        await Sql.conectar(async (sql: Sql) => {
            await sql.query("UPDATE pergunta SET perg_img = perg_img + 1 WHERE quiz_id = ? AND perg_id = ?", [quiz_id, perg_id]);

            if (sql.linhasAfetadas) {
                res = await sql.scalar("SELECT perg_img FROM pergunta WHERE quiz_id = ? AND perg_id = ?", [quiz_id, perg_id]) as number;
            }
		});

        return res;
    }

	public static async incrementarVersaoImagemResposta(quiz_id: number, perg_id: number): Promise<number> {
        let res = 0;

        await Sql.conectar(async (sql: Sql) => {
            await sql.query("UPDATE pergunta SET perg_resp_img = perg_resp_img + 1 WHERE quiz_id = ? AND perg_id = ?", [quiz_id, perg_id]);

            if (sql.linhasAfetadas) {
                res = await sql.scalar("SELECT perg_resp_img FROM pergunta WHERE quiz_id = ? AND perg_id = ?", [quiz_id, perg_id]) as number;
            }
		});

        return res;
    }

	public static async incrementarVersaoImagemAlternativa(quiz_id: number, perg_id: number, alt_id: number): Promise<number> {
        let res = 0;

        await Sql.conectar(async (sql: Sql) => {
            await sql.query("UPDATE alternativa SET alt_img = alt_img + 1 WHERE perg_id = ? AND alt_id = ?", [perg_id, alt_id]);

            if (sql.linhasAfetadas) {
                res = await sql.scalar("SELECT alt_img FROM alternativa WHERE perg_id = ? AND alt_id = ?", [perg_id, alt_id]) as number;
            }
		});

        return res;
    }
};
