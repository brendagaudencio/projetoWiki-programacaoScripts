// middleware/authMiddleware.js - Middleware de Autenticação Separado

/**
 * Middleware para verificar se usuário está autenticado
 * Usado em rotas que exigem login obrigatório
 */
const requireAuth = (req, res, next) => {
    // Verificar se existe sessão ativa
    if (!req.session || !req.session.userId) {
        req.flash('error', 'Você precisa estar logado para acessar esta página.');
        return res.redirect('/auth/login');
    }

    // Verificar se a sessão ainda é válida (usuário existe e está ativo)
    const { User } = require('../models');
    
    User.findByPk(req.session.userId)
        .then(user => {
            if (!user || !user.ativo) {
                // Usuário não existe ou está inativo - destruir sessão
                req.session.destroy((err) => {
                    if (err) console.error('Erro ao destruir sessão:', err);
                });
                req.flash('error', 'Sua sessão expirou. Faça login novamente.');
                return res.redirect('/auth/login');
            }
            
            // Usuário válido - permitir acesso
            next();
        })
        .catch(error => {
            console.error('Erro no middleware de autenticação:', error);
            req.flash('error', 'Erro interno. Tente novamente.');
            res.redirect('/auth/login');
        });
};

/**
 * Middleware para redirecionar usuários já logados
 * Usado em páginas de login/cadastro
 */
const redirectIfLoggedIn = (req, res, next) => {
    if (req.session && req.session.userId) {
        return res.redirect('/');
    }
    next();
};

module.exports = {
    requireAuth,
    redirectIfLoggedIn
};