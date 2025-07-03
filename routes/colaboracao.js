// routes/colaboracao.js - COM MIDDLEWARE DE AUTENTICAÇÃO

const express = require('express');
const router = express.Router();
const ColaboracaoController = require('../controllers/ColaboracaoController');
const { requireAuth } = require('../middleware/authMiddleware');

// ====================================
// ROTAS PÚBLICAS (sem necessidade de login)
// ====================================

// Listar colaborações aprovadas (página pública)
router.get('/colaboracoes', ColaboracaoController.index);

// ====================================
// ROTAS PROTEGIDAS (necessitam login)
// ====================================

// Mostrar formulário de colaboração (APENAS usuários logados)
router.get('/colaborar', requireAuth, ColaboracaoController.showForm);

// Enviar colaboração (APENAS usuários logados)
router.post('/colaborar', requireAuth, ColaboracaoController.store);

// ====================================
// ROTAS DE DEBUG (desenvolvimento)
// ====================================

// Debug de colaborações
router.get('/debug/colaboracoes', ColaboracaoController.debug);

module.exports = router;