const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do EJS (template engine)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração de sessão
app.use(session({
    secret: 'ouiwine-brenda+marcos-2025',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 horas
}));

// ROTAS TEMPORÁRIAS (substituem seus arquivos HTML)

// Home - substitui home.html
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'OuiWine - Degustação de Vinhos',
        pageTitle: 'Bem-vindo ao OuiWine!'
    });
});

// Login - substitui login.html  
app.get('/login', (req, res) => {
    res.render('login', { 
        title: 'Login - OuiWine',
        error: null 
    });
});

// Colaborar - substitui colaborar.html
app.get('/colaborar', (req, res) => {
    res.render('colaborar', { 
        title: 'Colaborar - OuiWine',
        error: null,
        success: null 
    });
});

// Rota de teste para verificar se está funcionando
app.get('/test', (req, res) => {
    res.json({ 
        message: 'OuiWine Backend funcionando!',
        timestamp: new Date().toISOString()
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🍷 OuiWine rodando em http://localhost:${PORT}`);
    console.log('🚀 Versão: 2.0.0 - Fullstack (Brenda + Marcos)');
    console.log('📅 Iniciado em:', new Date().toLocaleString('pt-BR'));
});

module.exports = app;
