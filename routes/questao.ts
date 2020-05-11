import express = require("express");
import wrap = require("express-async-error-wrapper");
import Usuario = require("../models/usuario");
import appsettings = require("../appsettings");

const router = express.Router();

router.get("/criar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req);
	if (!u)
		res.redirect(appsettings.root + "/login");
	else
		res.render("questao/criar", { titulo: "Criar Questao", usuario: u });
}));




export = router;
