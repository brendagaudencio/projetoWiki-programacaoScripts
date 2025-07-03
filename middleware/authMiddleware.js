const { User } = require('../models');

const requireAuth = async (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.redirect('/auth/login');
    }

    try {
        const user = await User.findByPk(req.session.userId);
        
        if (!user) {
            req.session.destroy((err) => {
                if (err) console.error('Erro ao destruir sessão:', err);
            });
            return res.redirect('/auth/login');
        }
        
        next();
    } catch (error) {
        console.error('Erro no middleware de autenticação:', error);
        res.redirect('/auth/login');
    }
};

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