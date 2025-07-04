import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import db from '../models';
import { IUserRegister, IUserLogin } from '../types/user.interface';

const { User } = db;

class AuthController {
    
    static async loginPage(req: Request, res: Response): Promise<void> {
        res.render('login', { 
            title: 'Login - OuiWine'
        });
    }

    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, senha }: IUserLogin = req.body;

            if (!email || !senha) {
                req.flash('error', 'Email e senha são obrigatórios');
                res.redirect('/auth/login');
                return;
            }

            const user = await User.findOne({ 
                where: { email: email.toLowerCase() } 
            });
            
            if (!user) {
                req.flash('error', 'Email ou senha incorretos');
                res.redirect('/auth/login');
                return;
            }

            const senhaValida = await bcrypt.compare(senha, user.senha_hash);

            if (!senhaValida) {
                req.flash('error', 'Email ou senha incorretos');
                res.redirect('/auth/login');
                return;
            }

            // Configurar sessão do usuário
            (req.session as any).userId = user.id;
            (req.session as any).userEmail = user.email;
            (req.session as any).userName = user.nome;
            
            req.flash('success', `Bem-vindo, ${user.nome}!`);
            res.redirect('/');

        } catch (error) {
            console.error('Erro no login:', (error as Error).message);
            req.flash('error', 'Erro interno do servidor');
            res.redirect('/auth/login');
        }
    }

    static async register(req: Request, res: Response): Promise<void> {
        try {
            const { nome, email, senha, confirmarSenha }: IUserRegister = req.body;

            if (!nome || !email || !senha || !confirmarSenha) {
                req.flash('error', 'Todos os campos são obrigatórios');
                res.redirect('/auth/login');
                return;
            }

            if (senha !== confirmarSenha) {
                req.flash('error', 'Senhas não conferem');
                res.redirect('/auth/login');
                return;
            }

            if (senha.length < 6) {
                req.flash('error', 'Senha deve ter pelo menos 6 caracteres');
                res.redirect('/auth/login');
                return;
            }

            // Verificar email duplicado
            const emailExistente = await User.findOne({ 
                where: { email: email.toLowerCase() } 
            });
            
            if (emailExistente) {
                req.flash('error', 'Este email já está cadastrado');
                res.redirect('/auth/login');
                return;
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
            console.error('Erro no cadastro:', (error as Error).message);
            
            if ((error as any).name === 'SequelizeValidationError') {
                const mensagem = (error as any).errors.map((err: any) => err.message).join(', ');
                req.flash('error', mensagem);
            } else {
                req.flash('error', 'Erro interno do servidor');
            }
            
            res.redirect('/auth/login');
        }
    }

    static async logout(req: Request, res: Response): Promise<void> {
        req.session.destroy((err: any) => {
            if (err) {
                console.error('Erro no logout:', err);
            }
            res.redirect('/');
        });
    }
}

export default AuthController;