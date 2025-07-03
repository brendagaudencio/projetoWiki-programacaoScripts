const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { redirectIfLoggedIn } = require('../middleware/authMiddleware');

// Página de login (redireciona se já logado)
router.get('/login', redirectIfLoggedIn, AuthController.loginPage);

// Processar login
router.post('/login', redirectIfLoggedIn, AuthController.login);

// Processar cadastro
router.post('/register', redirectIfLoggedIn, AuthController.register);

// Logout
router.post('/logout', AuthController.logout);

module.exports = router;