"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const Usuario = require("../models/usuario");
const appsettings = require("../appsettings");
const router = express.Router();
router.get("/criar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u)
        res.redirect(appsettings.root + "/login");
    else
        res.render("questao/criar", { titulo: "Criar Questao", usuario: u });
}));
module.exports = router;
//# sourceMappingURL=questao.js.map