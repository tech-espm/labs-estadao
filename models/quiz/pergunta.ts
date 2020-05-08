// IMPORTS
    // Express
    import express = require('express');

    // SQL
    import Sql = require('../../infra/sql');

    // Env variables
    import appsettings = require('../../appsettings');

    // Models
    import Quiz = require('./quiz')
    import Alternativa = require('./alternativa');


    // File Upload
    import FS = require("../../infra/fs");
    import Upload = require("../../infra/upload");


export = class Pergunta {

    // Setting the fields para a classe Pergunta
    public id: number;
    public titulo: string; // form
    public texto: string; // form
    public img: number; // form
    public quiz_id: number; // LAST_INSERT_ID() , How ?????
    public pontuacao: number;  // form or default 1 ?
    public resp_texto: string; // Form
    public resp_img: number; // Form

    public static nomeArquivoImagem(id: number): string {
        return `p${id}.jpg`;
    }
    
    // Funcao para salvar a questao
    public static async createQuestion(p: Pergunta, arquivo:any): Promise<string> {
        let res: string;
        
        
        await Sql.conectar(async (sql: Sql) => {
            try{
                await sql.beginTransaction()
                
                //* Inserting the question the DB
                await sql.query('INSERT INTO pergunta (perg_titulo, perg_texto, perg_img, perg_pontuacao, perg_resp_texo, perg_resp_img, id_quiz) VALUES (?, ?, ?, ?, ?, ?)', [p.titulo, p.texto, p.img, p.pontuacao, p.resp_texto, p.resp_img, p.quiz_id])
                
                //* Getting the ID
                p.id = await sql.scalar('SELECT LAST_INSERT_ID()') as number;

                // File Upload
                await Upload.gravarArquivo(arquivo, Quiz.caminhoRelativoPasta(p.quiz_id), Pergunta.nomeArquivoImagem(p.id) ) // Imagen da Pergunta
                //await Upload.gravarArquivo(a_images, Pergunta.caminhoRelativoPasta(p.id), Alternativa + "." + Pergunta.extensaoImagem ) // Salvar as imagens das alternativas

                //* Salvando as alternativas 
                //for (let i = 0; i < a.length; i++) {
                //    a[i].perg_id = p.id;
                //    Alternativa.saveAlternative(a[i], a_images[i]); 
                //}


                await sql.commit()
            }
            catch(e){
                throw e;
            }
        });

        return res;
    }

    // Funcao para Editar/Atualizar a questao
    public static async editQuestion(): Promise<string> {
        return;
    }

    // Funcao para Deletar a questao
    public static async deleteQuestion(): Promise<string> {
        return;
    }





    
}