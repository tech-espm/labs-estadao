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
        res.render("quiz/criar", { titulo: "Criar Quiz", usuario: u });
}));
router.get("/editar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u)
        res.redirect(appsettings.root + "/login");
    else
        res.render("quiz/editar", { titulo: "Editar Quiz", usuario: u });
}));
router.get("/jogar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u)
        res.redirect(appsettings.root + "/login");
    else
        res.render("quiz/jogar", { layout: "layout-jogo", titulo: "Jogar", usuario: u });
}));
module.exports = router;
//# sourceMappingURL=quiz.js.map