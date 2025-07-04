class HomeController {
    static async renderHome(req, res) {
        try {
            res.render('index', {
                title: 'OuiWine - Degustação de Vinhos'
            });
        } catch (error) {
            console.error('Erro ao renderizar home:', error);
            res.status(500).render('error', {
                title: 'Erro - OuiWine',
                error: {
                    status: 500,
                    message: 'Erro interno do servidor'
                }
            });
        }
    }

    static async renderLogin(req, res) {
        try {
            res.render('login', {
                title: 'Login - OuiWine'
            });
        } catch (error) {
            console.error('Erro ao renderizar login:', error);
            res.status(500).render('error', {
                title: 'Erro - OuiWine',
                error: {
                    status: 500,
                    message: 'Erro interno do servidor'
                }
            });
        }
    }

    static async renderColaborar(req, res) {
        try {
            res.render('colaborar', {
                title: 'Colaborar - OuiWine'
            });
        } catch (error) {
            console.error('Erro ao renderizar colaborar:', error);
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

module.exports = HomeController;