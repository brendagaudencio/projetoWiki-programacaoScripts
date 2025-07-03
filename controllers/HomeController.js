// controllers/HomeController.js - VERSÃO CORRIGIDA

class HomeController {
    // 🏠 MÉTODO PARA: router.get('/', HomeController.renderHome)
    static async renderHome(req, res) {
        try {
            console.log('🏠 HomeController.renderHome - Renderizando home...');
            console.log('🔍 Middleware definiu: isLoggedIn =', res.locals.isLoggedIn, ', user =', res.locals.user?.nome || 'null');
            
            res.render('index', {
                title: 'OuiWine - Degustação de Vinhos'
                // ✅ CORREÇÃO: Não sobrescrever user! 
                // O middleware já definiu res.locals.isLoggedIn e res.locals.user
            });
            
            console.log('✅ View index renderizada com sucesso');
        } catch (error) {
            console.error('❌ Erro ao renderizar home:', error);
            res.status(500).render('error', {
                title: 'Erro - OuiWine',
                error: {
                    status: 500,
                    message: 'Erro interno do servidor'
                }
            });
        }
    }

    // 🔐 MÉTODO PARA: router.get('/login', HomeController.renderLogin)
    static async renderLogin(req, res) {
        try {
            console.log('🔐 HomeController.renderLogin - Renderizando login...');
            
            res.render('login', {
                title: 'Login - OuiWine'
                // ✅ CORREÇÃO: Não sobrescrever user!
            });
            
            console.log('✅ View login renderizada com sucesso');
        } catch (error) {
            console.error('❌ Erro ao renderizar login:', error);
            res.status(500).render('error', {
                title: 'Erro - OuiWine',
                error: {
                    status: 500,
                    message: 'Erro interno do servidor'
                }
            });
        }
    }

    // 📝 MÉTODO PARA: router.get('/colaborar', HomeController.renderColaborar)
    static async renderColaborar(req, res) {
        try {
            console.log('📝 HomeController.renderColaborar - Renderizando colaborar...');
            console.log('🔍 Middleware definiu: isLoggedIn =', res.locals.isLoggedIn, ', user =', res.locals.user?.nome || 'null');
            
            res.render('colaborar', {
                title: 'Colaborar - OuiWine'
                // ✅ CORREÇÃO: Não sobrescrever user!
            });
            
            console.log('✅ View colaborar renderizada com sucesso');
        } catch (error) {
            console.error('❌ Erro ao renderizar colaborar:', error);
            res.status(500).render('error', {
                title: 'Erro - OuiWine',
                error: {
                    status: 500,
                    message: 'Erro interno do servidor'
                }
            });
        }
    }
}

// ✅ EXPORT CORRETO
module.exports = HomeController;