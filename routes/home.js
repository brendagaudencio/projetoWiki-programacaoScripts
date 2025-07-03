const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/HomeController');

// Página inicial
router.get('/', HomeController.renderHome);

// Redirecionamento para login
router.get('/login', (req, res) => {
    res.redirect('/auth/login');
});

module.exports = router;