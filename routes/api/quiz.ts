// IMPORTS
    // Express
    import express = require('express');
    const router = express.Router();
    import multer = require("multer");

    // Error Handler
    import wrap = require("express-async-error-wrapper");

    // SQL
    import Sql = require('../../infra/sql');

    // Models
    import Pergunta = require('../../models/quiz/pergunta');
    import Quiz = require('../../models/quiz/quiz');



// ROTAS

    // Salvar Quiz
    router.post('/salvar', multer().single("imagem"), wrap(async (req:express.Request, res: express.Response) => {
        let q = req.body as Quiz;

        if(q){
            // Usar a funcao saveQuiz() 
            res.json(q.id);
        }
        res.status(400);
        /*
        $.ajax({
            ...
            success: function(data) {
                location.href = "/quiz/editar?id=" + data;
            }
        })
        */
    }));


    // Salvar Perguntas e Alternativas
    router.post('/salvarpergunta', multer().single("imagem"), wrap(async (req:express.Request, res: express.Response) => {
        let p = req.body as Pergunta;

        if(p){
            // Usar a funcao saveQuestion() 
            res.json(p.id);
        }
        res.status(400);
        /*
        $.ajax({
            ...
            success: function(data) {
                salvarAlternativas(data, alternativas, 0);
            }
        })
        salvarAlternativas(id_perg, alternativas, i) {
            enviar alternativas[i]
            $.ajax({
                ...
                success: function(data) {
                    if (i >= alternativas.length) {
                        alert("OK!!!")
                    } else {
                        salvarAlternativas(data, alternativas, i + 1);
                    }
                }
            })
        }
        */
    }));


    // Salvar Perguntas e Alternativas
    router.post('/salvaralternativa', multer().single("imagem"), wrap(async (req:express.Request, res: express.Response) => {
        let p = req.body as Pergunta;

        if(p){
            // Usar a funcao saveQuestion() 
        }

    }));

    // Editar Perguntas e Alternativas
    router.post('/editarpergunta', wrap(async (req:express.Request, res: express.Response) => {
        let p = req.body as Pergunta;

        // Usar a funcao editQuestion() 
        
    }));



export = router;





















