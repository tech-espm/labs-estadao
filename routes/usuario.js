"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const Perfil = require("../models/perfil");
const Usuario = require("../models/usuario");
const appsettings = require("../appsettings");
const router = express.Router();
router.all("/criar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin)
        res.redirect(appsettings.root + "/acesso");
    else
        res.render("usuario/alterar", { titulo: "Criar Usuário", usuario: u, item: null, perfis: await Perfil.listar() });
}));
router.all("/alterar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect(appsettings.root + "/acesso");
    }
    else {
        let id = parseInt(req.query["id"]);
        let item = null;
        if (isNaN(id) || !(item = await Usuario.obter(id)))
            res.render("home/nao-encontrado", { usuario: u });
        else
            res.render("usuario/alterar", { titulo: "Editar Usuário", usuario: u, item: item, perfis: await Perfil.listar() });
    }
}));
router.get("/grade", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin)
        res.redirect(appsettings.root + "/acesso");
    else
        res.render("usuario/grade", { titulo: "Gerenciar Usuários", usuario: u, lista: await Usuario.listar() });
}));
router.get("/listar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin)
        res.redirect(appsettings.root + "/acesso");
    else
        res.render("usuario/listar", { titulo: "Gerenciar Usuários", usuario: u, lista: JSON.stringify(await Usuario.listar()) });
}));
module.exports = router;
//# sourceMappingURL=usuario.js.map