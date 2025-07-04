const bcrypt = require('bcryptjs');
const { User } = require('../models');

class AuthController {
    
    static async loginPage(req, res) {
        res.render('login', { 
            title: 'Login - OuiWine'
        });
    }

    static async login(req, res) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                req.flash('error', 'Email e senha são obrigatórios');
                return res.redirect('/auth/login');
            }

            const user = await User.findOne({ 
                where: { email: email.toLowerCase() } 
            });
            
            if (!user) {
                req.flash('error', 'Email ou senha incorretos');
                return res.redirect('/auth/login');
            }

            const senhaValida = await bcrypt.compare(senha, user.senha_hash);

            if (!senhaValida) {
                req.flash('error', 'Email ou senha incorretos');
                return res.redirect('/auth/login');
            }

            // Configurar sessão do usuário
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

    static async register(req, res) {
        try {
            const { nome, email, senha, confirmarSenha } = req.body;

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

            // Verificar email duplicado
            const emailExistente = await User.findOne({ 
                where: { email: email.toLowerCase() } 
            });
            
            if (emailExistente) {
                req.flash('error', 'Este email já está cadastrado');
                return res.redirect('/auth/login');
            }

            const senha_hash = await bcrypt.hash(senha, 10);
            
            await User.create({
                nome: nome.trim(),
                email: email.toLowerCase().trim(),
                senha_hash: senha_hash
            });

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

    static async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Erro no logout:', err);
            }
            res.redirect('/');
        });
    }
}

module.exports = AuthController;