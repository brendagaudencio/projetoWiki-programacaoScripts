import express, { Router } from 'express';
const HomeController = require('../../controllers/HomeController'); // Manter JS

const router: Router = express.Router();

// Página inicial
router.get('/', HomeController.renderHome);

// Redirecionamento para login
router.get('/login', (req, res) => {
    res.redirect('/auth/login');
});

export default router;