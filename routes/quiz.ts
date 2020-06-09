﻿import express = require("express");
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
		res.render("quiz/criar", {titulo: "Novo Quiz",usuario: u, lista: await Tipo.ListarTipo() });
}));

router.get("/editar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req);
	if (!u)
		res.redirect(appsettings.root + "/login");
	else
		res.render("quiz/editar", { titulo: "Editar Quiz", usuario: u });
}));

router.get("/jogar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req);
	if (!u)
		res.redirect(appsettings.root + "/login");
	else
		res.render("quiz/jogar", { layout:"layout-jogo", titulo: "Jogar", usuario: u });
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
		res.render("quiz/listar", { titulo: "Gerenciar Quiz", usuario: u, lista: JSON.stringify(await Quiz.listar()) });
}));

export = router;
