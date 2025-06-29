// ========================================
// OUIWINE - SERVIDOR EXPRESS COM ROTAS
// ========================================

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// CONFIGURAÇÕES BÁSICAS
// ========================================

// Template engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsing de formulários
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ========================================
// ROTAS BÁSICAS (SEM CONTROLLERS POR ENQUANTO)
// ========================================

// HOME - Página principal sobre vinhos
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'OuiWine - Degustação de Vinhos' 
    });
});

// LOGIN - Página login/cadastro
app.get('/login', (req, res) => {
    res.render('login', { 
        title: 'Login - OuiWine' 
    });
});

// COLABORAR - Página formulário colaboração
app.get('/colaborar', (req, res) => {
    res.render('colaborar', { 
        title: 'Colaborar - OuiWine' 
    });
});

// ========================================
// ROTAS POST (PREPARADAS PARA BACKEND)
// ========================================

// LOGIN - Processar login
app.post('/auth/login', (req, res) => {
    // TODO: Implementar lógica de login com banco
    console.log('Login tentativa:', req.body);
    res.redirect('/');
});

// CADASTRO - Processar cadastro
app.post('/auth/register', (req, res) => {
    // TODO: Implementar lógica de cadastro com banco
    console.log('Cadastro tentativa:', req.body);
    res.redirect('/login');
});

// COLABORAR - Processar formulário colaboração
app.post('/colaborar', (req, res) => {
    // TODO: Implementar salvamento no banco
    console.log('Nova colaboração:', req.body);
    res.redirect('/colaborar?sucesso=1');
});

// ========================================
// MIDDLEWARE DE ERRO 404
// ========================================

app.use((req, res) => {
    res.status(404).render('index', { 
        title: 'Página não encontrada - OuiWine',
        erro: `Página ${req.url} não encontrada` 
    });
});

// ========================================
// INICIAR SERVIDOR
// ========================================

app.listen(PORT, () => {
    console.log(`🍷 Servidor OuiWine rodando em http://localhost:${PORT}`);
    console.log(`📋 Rotas disponíveis:`);
    console.log(`   GET  / (home)`);
    console.log(`   GET  /login`);
    console.log(`   GET  /colaborar`);
    console.log(`   POST /auth/login`);
    console.log(`   POST /auth/register`);
    console.log(`   POST /colaborar`);
});
