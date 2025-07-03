// routes/auth.js - COM MIDDLEWARE DE REDIRECIONAMENTO

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { redirectIfLoggedIn } = require('../middleware/authMiddleware');

// ====================================
// ROTAS DE AUTENTICAÇÃO
// ====================================

// Página de login (redireciona se já estiver logado)
router.get('/login', redirectIfLoggedIn, AuthController.loginPage);

// Processar login
router.post('/login', redirectIfLoggedIn, AuthController.login);

// Processar cadastro
router.post('/register', redirectIfLoggedIn, AuthController.register);

// Logout (disponível apenas para usuários logados)
router.post('/logout', AuthController.logout);

// ====================================
// ROTAS DE DEBUG (desenvolvimento)
// ====================================

// Debug de usuários
router.get('/debug', AuthController.debug);

module.exports = router;