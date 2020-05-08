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
        await Sql.conectar(async (sql: Sql)=> {
            try{
                await sql.beginTransaction();

                await sql.query('INSERT INTO quiz (quiz_nome, quiz_desc, quiz_img, id_tipo) VALUES (?, ?, ?, ?)', [q.nome, q.desc, q.img, q.tipo_id]); //TODO falta a descricao no DB

                q.id = await sql.scalar('SELECT LAST_INSERT_ID()') as number; //* Getting the quiz ID - Send to the Pergunta!!
                
                await FS.criarDiretorio(Quiz.caminhoRelativoPasta(q.id));

                // File Upload 
                await Upload.gravarArquivo(imagem, Quiz.caminhoRelativoPasta(q.id), Quiz.nomeArquivoImagem(q.id) ) //TODO - Check Rafa's project


                await sql.commit()
            }
            catch(e){
                throw e;
            }

        })
        
        return;
    }

    // Funcao para Salvar o QUIZ
    public static async saveQuiz(q: Quiz): Promise<string> {

        return;
    }

    // Funcao para criar uma nova PERGUNTA

    
}