"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const Usuario = require("../models/usuario");
const appsettings = require("../appsettings");
const router = express.Router();
router.all("/", wrap(async (req, res) => {
    res.render("home/index", { layout: "layout-externo" });
}));
router.all("/login", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u) {
        let mensagem = null;
        if (req.body.login || req.body.senha) {
            [mensagem, u] = await Usuario.efetuarLogin(req.body.login, req.body.senha, res);
            if (mensagem)
                res.render("home/login", { layout: "layout-externo", mensagem: mensagem });
            else
                res.redirect(appsettings.root + "/dashboard");
        }
        else {
            res.render("home/login", { layout: "layout-externo", mensagem: null });
        }
    }
    else {
        res.redirect(appsettings.root + "/dashboard");
    }
}));
router.get("/dashboard", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u)
        res.redirect(appsettings.root + "/login");
    else
        res.render("home/dashboard", { titulo: "Dashboard", usuario: u });
}));
router.get("/acesso", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u)
        res.redirect(appsettings.root + "/login");
    else
        res.render("home/acesso", { titulo: "Sem Permissão", usuario: u });
}));
router.get("/perfil", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u)
        res.redirect(appsettings.root + "/");
    else
        res.render("home/perfil", { titulo: "Meu Perfil", usuario: u });
}));
router.get("/logout", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (u)
        await u.efetuarLogout(res);
    res.redirect(appsettings.root + "/");
}));
module.exports = router;
//# sourceMappingURL=home.js.map