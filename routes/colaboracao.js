const express = require('express');
const router = express.Router();
const ColaboracaoController = require('../controllers/ColaboracaoController');
const { requireAuth } = require('../middleware/authMiddleware');

// Página pública - listar colaborações
router.get('/colaboracoes', ColaboracaoController.index);

// Páginas protegidas - formulário e envio
router.get('/colaborar', requireAuth, ColaboracaoController.showForm);
router.post('/colaborar', requireAuth, ColaboracaoController.store);

module.exports = router;