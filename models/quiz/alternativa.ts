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




export = class Alternativa {

    public static readonly extensaoImagem = "png";

    // Setting the fields para a classe Alternativa
    public id: number;
    public texto: string; // Form
    public correta: boolean; // Form
    public img: number; // Form
    public perg_id: number; // LAST_INSERT_ID()


    public static caminhoRelativoPasta(perg_id: number): string {
		return `public/uploads/quiz/${perg_id}`;
    }
    
    // Funcao para salvar as alternativas
    public static async saveAlternative(a: Alternativa, arquivo: any, pergID: number): Promise<string> {
        let res: string;

        await Sql.conectar(async (sql: Sql) => {
            try{
                await sql.beginTransaction();

                await sql.query('INSERT INTO alternativa (alt_texto, alt_img, alt_correta, id_perg) VALUES (?, ?, ?, ?)', [a.texto, a.img, a.correta, a.perg_id])

                a.id = await sql.scalar('SELECT LAST_INSERT_ID()');

                await sql.commit()
            }
            catch(e){
                throw e;
            }
        });

        return res;
    }

    // Funcao para Editar/Atualizar a questao
    public static async updateAlternative(): Promise<string> {
        return;
    }


    
}








