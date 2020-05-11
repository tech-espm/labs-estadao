// IMPORTS
    // Express
    import express = require('express');

    // SQL
    import Sql = require('../../infra/sql');

    // Env variables
    import appsettings = require('../../appsettings');


export = class Tipo {

    // Setting the variables para o tipo
    public id: number;
    public nome: string;
    public desc: string; // Descricao do tipo de quiz


    public static async ListarTipo(): Promise<Tipo[]>{
        let lista: Tipo[] = null;

        await Sql.conectar(async (sql: Sql) => {
            lista = await sql.query("SELECT * FROM tipo") as Tipo[];
            
        });

        return(lista || []) ;
    }

    
}