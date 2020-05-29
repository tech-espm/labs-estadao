// IMPORTS
// Express
import express = require("express");

// SQL
import Sql = require("../../infra/sql");

// Env variables
import appsettings = require("../../appsettings");

// File Upload
import FS = require("../../infra/fs");
import Upload = require("../../infra/upload");

export = class Armazenamento {
	public static caminhoRelativoPastaQuiz(quiz_id: number): string {
		return `public/uploads/quiz/${quiz_id}`;
	}

	public static caminhoRelativoPastaPergunta(quiz_id: number, perg_id: number): string {
		return `public/uploads/quiz/${quiz_id}/${perg_id}`;
	}

	public static nomeImagem(perg_id: number): string {
		return `p${perg_id}.jpg`;
	}

	public static nomeImagemResposta(perg_id: number): string {
		return `r${perg_id}.jpg`;
	}

	public static nomeImagemAlternativa(alt_id: number): string {
		return `a${alt_id}.jpg`;
	}

	public static async criarPastaQuiz(quiz_id: number): Promise<void> {
    	await FS.criarDiretorio(Armazenamento.caminhoRelativoPastaQuiz(quiz_id));
	}

	public static async criarPastaPergunta(quiz_id: number, perg_id: number): Promise<void> {
    	await FS.criarDiretorio(Armazenamento.caminhoRelativoPastaPergunta(quiz_id, perg_id));
	}

	public static async excluirPastaQuiz(quiz_id: number): Promise<void> {
    	await FS.excluirArquivosEDiretorio(Armazenamento.caminhoRelativoPastaQuiz(quiz_id));
	}

	public static async excluirPastaPergunta(quiz_id: number, perg_id: number): Promise<void> {
    	await FS.excluirArquivosEDiretorio(Armazenamento.caminhoRelativoPastaPergunta(quiz_id, perg_id));
	}

	public static async gravarImagem(quiz_id: number, perg_id: number, arquivo: any): Promise<void> {
    	await Upload.gravarArquivo(arquivo, Armazenamento.caminhoRelativoPastaPergunta(quiz_id, perg_id), Armazenamento.nomeImagem(perg_id));
	}

	public static async gravarImagemResposta(quiz_id: number, perg_id: number, arquivo: any): Promise<void> {
    	await Upload.gravarArquivo(arquivo, Armazenamento.caminhoRelativoPastaPergunta(quiz_id, perg_id), Armazenamento.nomeImagemResposta(perg_id));
	}

	public static async gravarImagemAlternativa(quiz_id: number, perg_id: number, alt_id: number, arquivo: any): Promise<void> {
    	await Upload.gravarArquivo(arquivo, Armazenamento.caminhoRelativoPastaPergunta(quiz_id, perg_id), Armazenamento.nomeImagemAlternativa(alt_id));
	}

	public static async excluirImagem(quiz_id: number, perg_id: number): Promise<void> {
    	await FS.excluirArquivo(FS.concatenarCaminhosRelativos(Armazenamento.caminhoRelativoPastaPergunta(quiz_id, perg_id), Armazenamento.nomeImagem(perg_id)));
	}

	public static async excluirImagemResposta(quiz_id: number, perg_id: number): Promise<void> {
    	await FS.excluirArquivo(FS.concatenarCaminhosRelativos(Armazenamento.caminhoRelativoPastaPergunta(quiz_id, perg_id), Armazenamento.nomeImagemResposta(perg_id)));
	}

	public static async excluirImagemAlternativa(quiz_id: number, perg_id: number, alt_id: number): Promise<void> {
    	await FS.excluirArquivo(FS.concatenarCaminhosRelativos(Armazenamento.caminhoRelativoPastaPergunta(quiz_id, perg_id), Armazenamento.nomeImagemAlternativa(alt_id)));
	}
}
