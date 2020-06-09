// IMPORTS
    // Express
    import express = require('express');

    // SQL
    import Sql = require('../../infra/sql');

    // Env variables
    import appsettings = require('../../appsettings');

    // File Upload
    import FS = require("../../infra/fs");
    import Upload = require("../../infra/upload");


export = class Quiz {

    // Setting the fields para a classe quiz
    public quiz_id: number;
    public quiz_nome: string; // Form
    public quiz_desc: string; // Form
    public quiz_style: string; // Form
    public quiz_script: string; // Form
    public quiz_img: number; // Form
    public id_tipo: number; // Tipo FK

    public static nomeArquivoImagem(quiz_id: number): string {
        return `${quiz_id}.jpg`;
    }

    public static caminhoRelativoPasta(quiz_id: number): string {
		return `public/uploads/quiz/${quiz_id}`;
    }

    // Funcao para Criar um novo QUIZ
    public static async createQuiz(q: Quiz, imagem: any): Promise<string>{
        let res: string = null;
        
        await Sql.conectar(async (sql: Sql)=> {
            try {
                await sql.beginTransaction();

                await sql.query('INSERT INTO quiz (quiz_nome, quiz_desc, quiz_style, quiz_script, quiz_img, id_tipo) VALUES (?, ?, ?, ?, 1, ?)', [q.quiz_nome, q.quiz_desc, q.quiz_style, q.quiz_script, q.id_tipo]); //TODO falta a descricao no DB

                q.quiz_id = await sql.scalar('SELECT LAST_INSERT_ID()') as number; 
                
                await FS.criarDiretorio(Quiz.caminhoRelativoPasta(q.quiz_id));

                // File Upload
                if (imagem) {
                    await Upload.gravarArquivo(imagem, Quiz.caminhoRelativoPasta(q.quiz_id), Quiz.nomeArquivoImagem(q.quiz_id) );
                }
                
                await sql.commit();
                
                res = q.quiz_id.toString();
            } catch (e) {
                res = (e.message || e.toString());
            }
        })
        
        return res;
    }

    public static async listar(): Promise<Quiz[]> {
		let lista: Quiz[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = await sql.query("select u.quiz_id, u.quiz_nome, u.quiz_data_cria from quiz u inner join perfil p on p.id = u.idperfil order by u.login asc") as Quiz[];
		});

		return (lista || []);
	}
    
}
