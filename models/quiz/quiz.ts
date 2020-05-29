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
    public id: number;
    public nome: string; // Form
    public desc: string; // Form
    public img: number; // Form
    public tipo_id: number; // Tipo FK

    public static nomeArquivoImagem(id: number): string {
        return `${id}.jpg`;
    }

    public static caminhoRelativoPasta(id: number): string {
		return `public/uploads/quiz/${id}`;
    }


    // Funcao para Criar um novo QUIZ
    public static async createQuiz(q: Quiz, imagem: any): Promise<string>{
        let res: string = null;
        
        await Sql.conectar(async (sql: Sql)=> {
            try {
                await sql.beginTransaction();

                await sql.query('INSERT INTO quiz (quiz_nome, quiz_desc, quiz_img, id_tipo) VALUES (?, ?, 1, ?)', [q.nome, q.desc, q.tipo_id]); //TODO falta a descricao no DB

                q.id = await sql.scalar('SELECT LAST_INSERT_ID()') as number; 
                
                await FS.criarDiretorio(Quiz.caminhoRelativoPasta(q.id));

                // File Upload 
                await Upload.gravarArquivo(imagem, Quiz.caminhoRelativoPasta(q.id), Quiz.nomeArquivoImagem(q.id) );
                
                res = q.id.toString();

                await sql.commit()
                res = q.id.toString()
                
            } catch (e) {
                res = (e.message || e.toString());
            }
        })
        
        return res;
    }

    
}
