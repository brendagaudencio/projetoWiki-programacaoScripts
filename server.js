// server.js - OuiWine - Versão Final com Middlewares de Autenticação

const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

// Importar models e rotas
const { sequelize, User } = require('./models');
const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');
const colaboracaoRoutes = require('./routes/colaboracao');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== CONFIGURAÇÕES BÁSICAS =====
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ===== CONFIGURAÇÃO DE SESSÃO =====
app.use(session({
    secret: process.env.SESSION_SECRET || 'ouiwine-secret-key-2025',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true apenas em HTTPS
        httpOnly: true, // Previne acesso via JavaScript no browser
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// ===== FLASH MESSAGES =====
app.use(flash());

// ===== MIDDLEWARE DE AUTENTICAÇÃO GLOBAL =====
// Este middleware popula locals.isLoggedIn e locals.user para TODAS as views
app.use(async (req, res, next) => {
    try {
        // Flash messages sempre disponíveis
        res.locals.messages = req.flash();
        
        // Inicializar como não logado
        res.locals.isLoggedIn = false;
        res.locals.user = null;
        
        // Verificar se existe sessão ativa
        if (req.session?.userId) {
            const user = await User.findByPk(req.session.userId);
            
            if (user?.ativo) {
                // Usuário válido - popular dados para as views
                res.locals.isLoggedIn = true;
                res.locals.user = {
                    id: user.id,
                    nome: user.nome,
                    email: user.email
                };
            } else {
                // Usuário inválido - limpar sessão
                req.session.destroy();
            }
        }
        
    } catch (error) {
        console.error('Erro no middleware global de autenticação:', error.message);
        res.locals.isLoggedIn = false;
        res.locals.user = null;
    }
    
    next();
});

// ===== MIDDLEWARE DE SEGURANÇA =====
// Headers de segurança básicos
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// ===== ROTAS =====
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/', colaboracaoRoutes);

// ===== TRATAMENTO DE ERROS =====

// Middleware para rota não encontrada (404)
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

// Middleware para erros internos (500)
app.use((err, req, res, next) => {
    console.error('❌ Erro interno do servidor:', err.stack);
    
    // Em produção, não expor detalhes do erro
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

// ===== INICIALIZAÇÃO =====
async function startServer() {
    try {
        // Sincronizar banco de dados
        await sequelize.sync();
        console.log('✅ Banco de dados sincronizado');

        // Executar migrations pendentes
        try {
            console.log('🔄 Executando migrations...');
            const { exec } = require('child_process');
            await new Promise((resolve, reject) => {
                exec('npx sequelize-cli db:migrate', (error, stdout, stderr) => {
                    if (error && !error.message.includes('No migrations were executed')) {
                        console.log('ℹ️ Migrations:', stderr || stdout);
                    }
                    resolve();
                });
            });
            console.log('✅ Migrations executadas');
        } catch (migrationError) {
            console.log('ℹ️ Migrations:', migrationError.message);
        }

        // Executar seeder admin
        try {
            const adminSeeder = require('./seeds/admin-seeder');
            await adminSeeder();
            console.log('✅ Admin seeder executado');
        } catch (seedError) {
            console.log('ℹ️ Admin seeder:', seedError.message);
        }

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log('\n🍷 ===== OUIWINE SERVIDOR INICIADO =====');
            console.log(`🌐 Acesso: http://localhost:${PORT}`);
            console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
            console.log('🧪 Rotas de debug:');
            console.log(`   • http://localhost:${PORT}/auth/debug (usuários)`);
            console.log(`   • http://localhost:${PORT}/debug/colaboracoes (colaborações)`);
            console.log('==========================================\n');
        });

    } catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error.message);
        process.exit(1);
    }
}

// ===== GRACEFUL SHUTDOWN =====
process.on('SIGINT', async () => {
    console.log('\n🛑 Encerrando servidor OuiWine...');
    
    try {
        await sequelize.close();
        console.log('✅ Conexões do banco fechadas');
    } catch (error) {
        console.error('❌ Erro ao fechar banco:', error.message);
    }
    
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 SIGTERM recebido, encerrando graciosamente...');
    
    try {
        await sequelize.close();
    } catch (error) {
        console.error('❌ Erro ao fechar banco:', error.message);
    }
    
    process.exit(0);
});

// Iniciar aplicação
startServer();