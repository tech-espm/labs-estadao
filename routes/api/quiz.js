"use strict";
// IMPORTS
// Express
const express = require("express");
const router = express.Router();
const multer = require("multer");
// Error Handler
const wrap = require("express-async-error-wrapper");
// ROTAS
// Salvar Quiz
router.post('/salvar', multer().single("imagem"), wrap(async (req, res) => {
    let q = req.body;
    if (q) {
        // Usar a funcao saveQuiz() 
        res.json(q.id);
    }
    res.status(400);
    /*
    $.ajax({
        ...
        success: function(data) {
            location.href = "/quiz/editar?id=" + data;
        }
    })
    */
}));
// Salvar Perguntas e Alternativas
router.post('/salvarpergunta', multer().single("imagem"), wrap(async (req, res) => {
    let p = req.body;
    if (p) {
        // Usar a funcao saveQuestion() 
        res.json(p.id);
    }
    res.status(400);
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
// Salvar Perguntas e Alternativas
router.post('/salvaralternativa', multer().single("imagem"), wrap(async (req, res) => {
    let p = req.body;
    if (p) {
        // Usar a funcao saveQuestion() 
    }
}));
// Editar Perguntas e Alternativas
router.post('/editarpergunta', wrap(async (req, res) => {
    let p = req.body;
    // Usar a funcao editQuestion() 
}));
module.exports = router;
//# sourceMappingURL=quiz.js.map