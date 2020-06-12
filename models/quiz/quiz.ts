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
<<<<<<< HEAD
			lista = await sql.query("SELECT q.quiz_id, q.quiz_nome, q.quiz_desc, t.tipo_nome FROM quiz q INNER JOIN tipo t ON q.id_tipo = t.tipo_id") as Quiz[];
        });
        
=======
			lista = await sql.query("select quiz_id, quiz_nome, quiz_data_cria from quiz order by quiz_id asc") as Quiz[];
		});
>>>>>>> b191382161c9d2c0816477f61f2a5b7865fc4600

		return (lista || []);
    }
    
    public static async obter(id): Promise<Quiz> {
        let lista: Quiz[] = null;

		await Sql.conectar(async (sql: Sql) => {
            
			lista = await sql.query("SELECT quiz_id, quiz_nome, quiz_desc,quiz_style, quiz_script, id_tipo, quiz_img  FROM quiz WHERE quiz_id = ?", [id]) as Quiz[];
            
		});

		return ((lista && lista[0]) || null);
    }

    
	public static async editar(q: Quiz): Promise<string> {
		let res: string = null;

		await Sql.conectar(async (sql: Sql) => {
            await sql.beginTransaction();

            // Inserting the question the DB
            await sql.query(
                "UPDATE quiz SET quiz_nome = ?, quiz_desc = ?, quiz_style = ?, quiz_script = ?, id_tipo = ? WHERE quiz_id = ?",
                [q.quiz_nome, q.quiz_desc,q.quiz_style, q.quiz_script, q.id_tipo, q.quiz_id]
            );

            
            await sql.commit();
		});

		return res;
    }
    
    public static async incrementarVersaoImagem(quiz_id: number): Promise<number> {
        let res = 0;

        await Sql.conectar(async (sql: Sql) => {
            await sql.query("UPDATE quiz SET quiz_img = quiz_img + 1 WHERE quiz_id = ? ", [quiz_id]);

            if (sql.linhasAfetadas) {
                res = await sql.scalar("SELECT quiz_img FROM quiz WHERE quiz_id = ? ", [quiz_id]) as number;
            }
		});

        return res;
    }

    public static async excluir(quiz_id: number ): Promise<string>{
		let res: string = null;

        await Sql.conectar(async (sql: Sql) => {
            await sql.query("DELETE FROM quiz WHERE quiz_id = ?", [quiz_id]);
        
        });

        return res;
    }
    
}
