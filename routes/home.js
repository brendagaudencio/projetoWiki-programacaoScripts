// routes/home.js - VERSÃO CORRIGIDA (sem rota /colaborar)

const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/HomeController');

// ====================================
// ROTAS APENAS DO HOME
// ====================================

// Página inicial (home com conteúdo sobre vinhos)
router.get('/', HomeController.renderHome);

// Página de login/cadastro (redirecionamento para /auth/login)
router.get('/login', (req, res) => {
    res.redirect('/auth/login');
});

// ❌ ROTA /colaborar REMOVIDA DAQUI
// Agora é gerenciada apenas por routes/colaboracao.js

module.exports = router;