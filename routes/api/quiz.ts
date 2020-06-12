// IMPORTS
// Express
import express = require("express");
const router = express.Router();

// Multer
import multer = require("multer");

// Util
import jsonRes = require("../../utils/jsonRes");
import validaArquivo = require("../../utils/validaArquivo");

// Error Handler
import wrap = require("express-async-error-wrapper");

// SQL
import Sql = require("../../infra/sql");

// Models
import Armazenamento = require("../../models/quiz/armazenamento");
import Pergunta = require("../../models/quiz/pergunta");
import Quiz = require("../../models/quiz/quiz");
import Alternativa = require("../../models/quiz/alternativa");
import Usuario = require("../../models/usuario");
import { route } from "../home";

// ROTAS
// Salvar Quiz
router.post("/salvar", multer().single("imagem"), wrap(async (req: express.Request, res: express.Response) => {
    let q = req.body as Quiz;

    if (q) {
        q.id_tipo = parseInt(req.body.id_tipo);
    }

    jsonRes(res, 400, (q && (!req["file"] || validaArquivo(req["file"]))) ? await Quiz.createQuiz(q, req["file"]) : "Dados inválidos");
}));

router.post('/alterar', multer().single("imagem"), wrap(async (req: express.Request, res: express.Response) => {
    let q = req.body as Quiz;

    if (q) {
        q.quiz_id = parseInt(req.body.quiz_id);
        q.id_tipo = parseInt(req.body.id_tipo);
    }

    jsonRes(res, 400, (q && (!req["file"] || validaArquivo(req["file"]))) ? await Quiz.editar(q, req["file"]) : "Dados inválidos");
}));

// Salvar Perguntas e Alternativas
router.post("/salvarpergunta", wrap(async (req: express.Request, res: express.Response) => {
    const p = req.body as Pergunta;

    if (!p) {
        jsonRes(res, 400, "Dados inválidos!");
        return;
    }

    let erro = null;

    if (parseInt(req.body.perg_id)) {
        erro = await Pergunta.editar(p);
    } else {
        erro = await Pergunta.criar(p);
    }

    if (erro) {
        jsonRes(res, 400, erro);
    } else {
        res.json(p);
    }
}));

router.post("/uploadimagem", multer().single("imagem"), wrap(async (req: express.Request, res: express.Response) => {
    const quiz_id = parseInt(req.query.quiz_id);
    const perg_id = parseInt(req.query.perg_id);
    const alt_id = parseInt(req.query.alt_id);
    const tipo = req.query.tipo as string;

    if (tipo !== "p" && tipo !== "r" && tipo !== "a") {
        jsonRes(res, 400, "Tipo inválido!");
        return;
    }

    if (!validaArquivo(req["file"]) || isNaN(quiz_id) || isNaN(perg_id) || (tipo === "a" && isNaN(alt_id))) {
        jsonRes(res, 400, "Dados inválidos!");
        return;
    }

    let novaVersao = 0;

    switch (tipo) {
        case "p":
            await Armazenamento.gravarImagem(quiz_id, perg_id, req["file"]);
            novaVersao = await Pergunta.incrementarVersaoImagem(quiz_id, perg_id);
            break;
        case "r":
            await Armazenamento.gravarImagemResposta(quiz_id, perg_id, req["file"]);
            novaVersao = await Pergunta.incrementarVersaoImagemResposta(quiz_id, perg_id);
            break;
        default:
            await Armazenamento.gravarImagemAlternativa(quiz_id, perg_id, alt_id, req["file"]);
            novaVersao = await Pergunta.incrementarVersaoImagemAlternativa(quiz_id, perg_id, alt_id);
            break;
    }

    res.json(novaVersao);

}));

router.get("/listar", wrap(async (req: express.Request, res: express.Response) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    res.json(await Quiz.listar());
}));

router.get('/obterPergunta', wrap(async(req: express.Request, res: express.Response) => {

    let id = parseInt(req.query["quiz_id"]);

    res.json(await Pergunta.listar(id));

}));

router.get('/excluir', wrap(async(req: express.Request, res: express.Response) => {
    let id = parseInt(req.query["quiz_id"]);

    jsonRes(res, 400, isNaN(id) ? "Dados invalidos " : await Quiz.excluir(id));
    
}));

router.get('/excluirPerg', wrap(async(req: express.Request, res: express.Response) => {
    let quiz_id = parseInt(req.query["quiz_id"]);
    let perg_id = parseInt(req.query["perg_id"]);

    jsonRes(res, 400, (isNaN(quiz_id) || isNaN(perg_id)) ?  "Dados invalidos" : await Pergunta.excluir(quiz_id, perg_id));
    
}));

export = router;
