import express, { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { redirectIfLoggedIn } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Página de login (redireciona se já logado)
router.get('/login', redirectIfLoggedIn, AuthController.loginPage);

// Processar login
router.post('/login', redirectIfLoggedIn, AuthController.login);

// Processar cadastro
router.post('/register', redirectIfLoggedIn, AuthController.register);

// Logout
router.post('/logout', AuthController.logout);

export default router;