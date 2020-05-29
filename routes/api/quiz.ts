// IMPORTS
    // Express
    import express = require('express');
    const router = express.Router();

    // Multer
    import multer = require("multer");

    // Util
    import jsonRes = require("../../utils/jsonRes");
    import validaArquivo = require("../../utils/validaArquivo");

    // Error Handler
    import wrap = require("express-async-error-wrapper");

    // SQL
    import Sql = require('../../infra/sql');

    // Models
    import Pergunta = require('../../models/quiz/pergunta');
    import Quiz = require('../../models/quiz/quiz');
import Alternativa = require('../../models/quiz/alternativa');



// ROTAS
    // Salvar Quiz
    router.post('/salvar', multer().single("imagem"), wrap(async (req:express.Request, res: express.Response) => {
        let q = req.body as Quiz;

        if(q){
            q.nome = req.body.titulo
            q.desc = req.body.desc
            q.tipo_id = parseInt(req.body.tipo) 
        }

        jsonRes(res, 400, q && validaArquivo(req["file"]) ? await Quiz.createQuiz(q, req["file"]) : "Dados inválidos");

    }));


    // Salvar Perguntas e Alternativas
    router.post('/salvarpergunta', multer().single("imagem"), wrap(async (req:express.Request, res: express.Response) => {
        let p = new Pergunta;
        // let a1 = new Alternativa;
        // let a = [{a1.texto: req.body.alternativa1}]

        if(p){
            // Usar a funcao saveQuestion
            p.titulo = req.body.titulo;
            p.img = 1;
            p.pontuacao = 10;
            p.resp_img = 1;
            p.resp_texto = req.body.resp_texto;
            p.texto = req.body.desc;
            p.quiz_id = req.body.qid;         
        }
        console.log(p);
        jsonRes(res, 400, p && validaArquivo(req["file"]) ? await Pergunta.createQuestion(p, req["file"]) : "Dados invalidos !");        
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


    // Editar Perguntas e Alternativas
    router.post('/editarpergunta', wrap(async (req:express.Request, res: express.Response) => {
        let p = req.body as Pergunta;

        // Usar a funcao editQuestion() 
        
    }));



export = router;























