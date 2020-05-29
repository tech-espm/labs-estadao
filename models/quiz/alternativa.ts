// IMPORTS
// Express
import express = require("express");

// SQL
import Sql = require("../../infra/sql");

// Env variables
import appsettings = require("../../appsettings");

// Models
import Armazenamento = require("./armazenamento");

// File Upload
import FS = require("../../infra/fs");
import Upload = require("../../infra/upload");

export = class Alternativa {
	// Setting the fields para a classe Alternativa
	public alt_id: number;
	public alt_texto: string; // Form
	public alt_img: number; // Form
	public alt_correta: number; // Form
	public perg_id: number; // LAST_INSERT_ID()

	// Funcao para criar as alternativas
	public static async criar(sql: Sql, a: Alternativa): Promise<void> {
        await sql.query("INSERT INTO alternativa (alt_texto, alt_img, alt_correta, perg_id) VALUES (?, 0, ?, ?)", [a.alt_texto, a.alt_correta, a.perg_id]);

        a.alt_id = await sql.scalar("SELECT LAST_INSERT_ID()");
	}

	// Funcao para editar as alternativas
	public static async editar(sql: Sql, a: Alternativa): Promise<void> {
        await sql.query("UPDATE alternativa SET alt_texto = ?, alt_correta = ? WHERE alt_id = ?", [a.alt_texto, a.alt_correta, a.alt_id]);
    }

	// Funcao para excluir as alternativas
	public static async excluir(sql: Sql, quiz_id: number, perg_id: number, alt_id: number): Promise<void> {
        await sql.query("DELETE FROM alternativa WHERE perg_id = ? AND alt_id = ?", [perg_id, alt_id]);

        if (sql.linhasAfetadas) {
            try {
                await Armazenamento.excluirImagemAlternativa(quiz_id, perg_id, alt_id);
            } catch (ex) {
                // Apenas ignora, por hora...
            }
        }
    }
};
