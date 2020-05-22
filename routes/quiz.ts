import express = require("express");
import wrap = require("express-async-error-wrapper");

import appsettings = require("../appsettings");
import Usuario = require("../models/usuario");
import Tipo = require("../models/quiz/Tipo")


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

router.get("/criarPerg:qid", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req);
	if (!u)
		res.redirect(appsettings.root + "/login");
	else
		res.render("quiz/criarPerg", { titulo: "Criar Questao", usuario: u });
}));

export = router;
