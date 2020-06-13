import express = require("express");
import wrap = require("express-async-error-wrapper");

import appsettings = require("../appsettings");
import Usuario = require("../models/usuario");
import Tipo = require("../models/quiz/Tipo")
import Pergunta = require("../models/quiz/pergunta");
import Quiz = require("../models/quiz/quiz");

const router = express.Router();

router.get("/criar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req);
	if (!u)
		res.redirect(appsettings.root + "/login");
	else
		res.render("quiz/alterar", {titulo: "Novo Quiz",usuario: u, item: null, lista: await Tipo.ListarTipo() });
}));

router.get("/editar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req);
	if (!u){
		res.redirect(appsettings.root + "/login");
	}
	else{
		let id = parseInt(req.query["qid"]);
		let item: Quiz = null;

		if(isNaN(id) || !(item = await Quiz.obter(id))){
			res.render("home/nao-encontrado", { usuario: u });
		}
		else{
			res.render("quiz/alterar", { titulo: "Editar Quiz", usuario: u, item: item, lista: await Tipo.ListarTipo() });
		}
	}
}));

router.get("/jogar/:n", wrap(async (req: express.Request, res: express.Response) => {
	const quiz = await Quiz.obterPorNomeComPerguntas(req.params["n"] as string);
	if (!quiz) {
		res.render("shared/erro", { layout: "layout-externo" });
	} else {
		const quiz_style = quiz.quiz_style;
		const quiz_script = quiz.quiz_script;
		// Para não aparecer no JSON.stringify()
		quiz.quiz_style = null;
		quiz.quiz_script = null;
		res.render("quiz/jogar", { layout:"layout-jogo", titulo: "Jogar", quiz: JSON.stringify(quiz), quiz_style: quiz_style, quiz_script: quiz_script });
	}
}));

router.get("/criarPerg", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req);
	if (!u)
		res.redirect(appsettings.root + "/login");
	else
		res.render("quiz/editarPerg", { titulo: "Criar Pergunta", usuario: u, quiz_id: req.query.quiz_id, pergunta: null });
}));

router.get("/editarPerg", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req);
	if (!u)
		res.redirect(appsettings.root + "/login");
	else
		res.render("quiz/editarPerg", { titulo: "Editar Pergunta", usuario: u, quiz_id: req.query.quiz_id, pergunta: await Pergunta.obter(parseInt(req.query.quiz_id), parseInt(req.query.perg_id)) });
})); 

router.get("/listar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req);

	if (!u || !u.admin)
		res.redirect(appsettings.root + "/acesso");
	else
		res.render("quiz/listar", { titulo: "Gerenciar Quizes", usuario: u, lista: JSON.stringify(await Quiz.listar())});

}));

export = router;
