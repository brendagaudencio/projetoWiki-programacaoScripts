import { Request, Response } from 'express';
import { Op } from 'sequelize';
import db from '../models';
import { IColaboracaoCreation, IColaboracaoFilter } from '../types/colaboracao.interface';

const { Colaboracao, User } = db;

class ColaboracaoController {
    
    static async showForm(req: Request, res: Response): Promise<void> {
        try {
            res.render('colaborar', {
                title: 'Colaborar - OuiWine'
            });
        } catch (error) {
            console.error('Erro ao renderizar formulário colaborar:', (error as Error).message);
            res.status(500).render('error', {
                title: 'Erro - OuiWine',
                error: {
                    status: 500,
                    message: 'Erro interno do servidor'
                }
            });
        }
    }

    static async index(req: Request, res: Response): Promise<void> {
        try {
            const { busca, dataInicio, dataFim }: IColaboracaoFilter = req.query;
            const whereConditions: any = { status: 'aprovada' };
            
            // Filtro por palavra-chave
            if (busca && busca.trim()) {
                whereConditions[Op.or] = [
                    { nome: { [Op.like]: `%${busca.trim()}%` } },
                    { mensagem: { [Op.like]: `%${busca.trim()}%` } }
                ];
            }
            
            // Filtro por data
            if (dataInicio || dataFim) {
                whereConditions.createdAt = {};
                
                if (dataInicio) {
                    whereConditions.createdAt[Op.gte] = new Date(dataInicio + 'T00:00:00');
                }
                
                if (dataFim) {
                    whereConditions.createdAt[Op.lte] = new Date(dataFim + 'T23:59:59');
                }
            }

            const colaboracoes = await Colaboracao.findAll({
                where: whereConditions,
                order: [['createdAt', 'DESC']],
                attributes: ['id', 'nome', 'mensagem', 'createdAt']
            });

            res.render('colaboracoes', {
                title: 'Colaborações - OuiWine',
                colaboracoes: colaboracoes,
                filtros: { busca, dataInicio, dataFim }
            });

        } catch (error) {
            console.error('Erro ao carregar colaborações:', (error as Error).message);
            res.status(500).render('error', {
                title: 'Erro - OuiWine',
                error: {
                    status: 500,
                    message: 'Erro ao carregar colaborações'
                }
            });
        }
    }

    static async store(req: Request, res: Response): Promise<void> {
        try {
            const { nome, email, cpf, mensagem }: IColaboracaoCreation = req.body;
            const userId = (req.session as any).userId;

            console.log('🔍 DEBUG - Dados recebidos:', {
                nome: nome ? 'OK' : 'FALTANDO',
                email: email ? 'OK' : 'FALTANDO',
                cpf: cpf ? 'OK' : 'FALTANDO',
                mensagem: mensagem ? `${mensagem.length} chars` : 'FALTANDO',
                userId: userId || 'FALTANDO'
            });

            // Validações obrigatórias
            if (!nome || !email || !cpf || !mensagem) {
                req.flash('error', 'Todos os campos são obrigatórios.');
                res.redirect('/colaborar');
                return;
            }

            // Validar CPF
            const cpfLimpo = cpf.replace(/[^\d]/g, '');
            console.log('🔍 DEBUG - CPF limpo:', cpfLimpo);

            if (cpfLimpo.length !== 11 || !ColaboracaoController.isValidCPF(cpfLimpo)) {
                req.flash('error', 'CPF inválido. Verifique os números digitados.');
                res.redirect('/colaborar');
                return;
            }

            // Validar tamanho da mensagem
            const mensagemTrimmed = mensagem.trim();
            if (mensagemTrimmed.length < 10 || mensagemTrimmed.length > 500) {
                req.flash('error', 'A mensagem deve ter entre 10 e 500 caracteres.');
                res.redirect('/colaborar');
                return;
            }

            // Buscar usuário atual
            const user = await User.findByPk(userId);
            if (!user) {
                req.flash('error', 'Usuário não encontrado. Faça login novamente.');
                res.redirect('/auth/login');
                return;
            }

            console.log('🔍 DEBUG - Usuário encontrado:', user.nome);

            // Salvar CPF no User se ele não tiver
            if (!user.cpf) {
                try {
                    await user.update({ cpf: cpfLimpo });
                    console.log('✅ CPF salvo no usuário:', cpfLimpo);
                } catch (cpfError) {
                    console.error('⚠️ Erro ao salvar CPF no usuário:', (cpfError as Error).message);
                }
            } else {
                console.log('ℹ️ Usuário já possui CPF:', user.cpf);
            }

            // Criar colaboração
            const novaColaboracao = await Colaboracao.create({
                nome: nome.trim(),
                email: email.toLowerCase().trim(),
                cpf: cpfLimpo,
                mensagem: mensagemTrimmed,
                status: 'aprovada',
                userId: userId
            });

            console.log('✅ Colaboração criada com sucesso! ID:', novaColaboracao.id);

            req.flash('success', `Obrigado, ${nome.split(' ')[0]}! Sua história foi compartilhada com sucesso.`);
            res.redirect('/colaboracoes');

        } catch (error) {
            console.error('❌ ERRO COMPLETO ao salvar colaboração:', error);
            
            if ((error as any).name === 'SequelizeValidationError') {
                const mensagem = (error as any).errors.map((err: any) => `${err.path}: ${err.message}`).join(', ');
                req.flash('error', `Erro de validação: ${mensagem}`);
            } else if ((error as any).name === 'SequelizeForeignKeyConstraintError') {
                req.flash('error', 'Erro de relacionamento no banco. Faça login novamente.');
            } else {
                req.flash('error', `Erro interno: ${(error as Error).message}`);
            }
            
            res.redirect('/colaborar');
        }
    }

    // Validação de CPF
    private static isValidCPF(cpf: string): boolean {
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
            return false;
        }

        let soma = 0;
        let resto: number;

        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }

        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }

        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;

        return resto === parseInt(cpf.substring(10, 11));
    }
}

export default ColaboracaoController;