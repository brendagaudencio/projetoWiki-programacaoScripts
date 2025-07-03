// controllers/AuthController.js - VERSÃO FINAL LIMPA
const bcrypt = require('bcryptjs');
const { User } = require('../models');

class AuthController {
    
    // Página de login
    static async loginPage(req, res) {
        res.render('login', { 
            title: 'Login - OuiWine'
        });
    }

    // Processar login
    static async login(req, res) {
        try {
            const { email, senha } = req.body;

            // Validações básicas
            if (!email || !senha) {
                req.flash('error', 'Email e senha são obrigatórios');
                return res.redirect('/auth/login');
            }

            // Buscar usuário
            const user = await User.findOne({ 
                where: { email: email.toLowerCase() } 
            });
            
            if (!user) {
                req.flash('error', 'Email ou senha incorretos');
                return res.redirect('/auth/login');
            }

            // Verificar se usuário está ativo
            if (!user.ativo) {
                req.flash('error', 'Usuário inativo');
                return res.redirect('/auth/login');
            }

            // Verificar senha
            const senhaValida = await bcrypt.compare(senha, user.senha_hash);

            if (!senhaValida) {
                req.flash('error', 'Email ou senha incorretos');
                return res.redirect('/auth/login');
            }

            // Login bem-sucedido
            req.session.userId = user.id;
            req.session.userEmail = user.email;
            req.session.userName = user.nome;
            
            req.flash('success', `Bem-vindo, ${user.nome}!`);
            res.redirect('/');

        } catch (error) {
            console.error('Erro no login:', error.message);
            req.flash('error', 'Erro interno do servidor');
            res.redirect('/auth/login');
        }
    }

    // Processar cadastro
    static async register(req, res) {
        try {
            const { nome, email, senha, confirmarSenha } = req.body;

            // Validações
            if (!nome || !email || !senha || !confirmarSenha) {
                req.flash('error', 'Todos os campos são obrigatórios');
                return res.redirect('/auth/login');
            }

            if (senha !== confirmarSenha) {
                req.flash('error', 'Senhas não conferem');
                return res.redirect('/auth/login');
            }

            if (senha.length < 6) {
                req.flash('error', 'Senha deve ter pelo menos 6 caracteres');
                return res.redirect('/auth/login');
            }

            // Verificar se email já existe
            const emailExistente = await User.findOne({ 
                where: { email: email.toLowerCase() } 
            });
            
            if (emailExistente) {
                req.flash('error', 'Este email já está cadastrado');
                return res.redirect('/auth/login');
            }

            // Criar usuário
            const senha_hash = await bcrypt.hash(senha, 10);
            
            const novoUser = await User.create({
                nome: nome.trim(),
                email: email.toLowerCase().trim(),
                senha_hash: senha_hash,
                ativo: true
            });

            console.log(`✅ Novo usuário cadastrado: ${novoUser.nome}`);
            req.flash('success', 'Cadastro realizado com sucesso! Faça seu login.');
            res.redirect('/auth/login');

        } catch (error) {
            console.error('Erro no cadastro:', error.message);
            
            if (error.name === 'SequelizeValidationError') {
                const mensagem = error.errors.map(err => err.message).join(', ');
                req.flash('error', mensagem);
            } else {
                req.flash('error', 'Erro interno do servidor');
            }
            
            res.redirect('/auth/login');
        }
    }

    // Logout
    static async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Erro no logout:', err);
                return res.redirect('/');
            }
            res.redirect('/');
        });
    }

    // Debug de usuários (para desenvolvimento)
    static async debug(req, res) {
        try {
            const users = await User.findAll({
                attributes: ['id', 'nome', 'email', 'ativo', 'createdAt']
            });
            
            res.json({
                message: 'Debug de usuários',
                total: users.length,
                users: users
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = AuthController;