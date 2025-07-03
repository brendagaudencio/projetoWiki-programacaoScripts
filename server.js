const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const { sequelize, User } = require('./models');
const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');
const colaboracaoRoutes = require('./routes/colaboracao');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações básicas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração de sessão
app.use(session({
    secret: process.env.SESSION_SECRET || 'ouiwine-secret-key-2025',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(flash());

// Middleware global para dados do usuário
app.use(async (req, res, next) => {
    try {
        res.locals.messages = req.flash();
        res.locals.isLoggedIn = false;
        res.locals.user = null;
        
        if (req.session?.userId) {
            const user = await User.findByPk(req.session.userId, {
                attributes: ['id', 'nome', 'email', 'cpf', 'ativo']
            });
            
            // Verificar se usuário existe e está ativo
            if (user && (user.ativo === undefined || user.ativo === true || user.ativo === 1)) {
                res.locals.isLoggedIn = true;
                res.locals.user = {
                    id: user.id,
                    nome: user.nome,
                    email: user.email,
                    cpf: user.cpf
                };
            } else {
                req.session.destroy();
            }
        }
        
    } catch (error) {
        console.error('Erro no middleware global:', error.message);
        res.locals.isLoggedIn = false;
        res.locals.user = null;
    }
    
    next();
});

// Headers de segurança
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Rotas
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/', colaboracaoRoutes);

// Tratamento de erros 404
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Página não encontrada - OuiWine',
        error: {
            status: 404,
            message: 'A página que você procura não foi encontrada.',
            description: 'Verifique o endereço digitado ou navegue pelos links do menu.',
            showHomeLink: true
        }
    });
});

// Tratamento de erros 500
app.use((err, req, res, next) => {
    console.error('Erro interno do servidor:', err.stack);
    
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.status(500).render('error', {
        title: 'Erro interno - OuiWine',
        error: {
            status: 500,
            message: 'Ocorreu um erro interno no servidor.',
            description: isProduction 
                ? 'Nossa equipe foi notificada. Tente novamente em alguns minutos.'
                : err.message,
            showHomeLink: true
        }
    });
});

// Inicialização do servidor
async function startServer() {
    try {
        await sequelize.sync();
        console.log('Banco de dados sincronizado');

        app.listen(PORT, () => {
            console.log('\n🍷 ===== OUIWINE SERVIDOR INICIADO =====');
            console.log(`🌐 Acesso: http://localhost:${PORT}`);
            console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
            console.log('==========================================\n');
        });

    } catch (error) {
        console.error('Erro ao iniciar servidor:', error.message);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nEncerrando servidor OuiWine...');
    
    try {
        await sequelize.close();
        console.log('Conexões do banco fechadas');
    } catch (error) {
        console.error('Erro ao fechar banco:', error.message);
    }
    
    process.exit(0);
});

startServer();