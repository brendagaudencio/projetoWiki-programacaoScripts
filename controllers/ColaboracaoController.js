const { Colaboracao, User } = require('../models');

class ColaboracaoController {
    
    static async showForm(req, res) {
        try {
            res.render('colaborar', {
                title: 'Colaborar - OuiWine'
            });
        } catch (error) {
            console.error('Erro ao renderizar formulário colaborar:', error.message);
            res.status(500).render('error', {
                title: 'Erro - OuiWine',
                error: {
                    status: 500,
                    message: 'Erro interno do servidor'
                }
            });
        }
    }

    static async index(req, res) {
        try {
            const { busca, dataInicio, dataFim } = req.query;
            const whereConditions = { status: 'aprovada' };
            
            // Filtro por palavra-chave
            if (busca && busca.trim()) {
                const { Op } = require('sequelize');
                whereConditions[Op.or] = [
                    { nome: { [Op.like]: `%${busca.trim()}%` } },
                    { mensagem: { [Op.like]: `%${busca.trim()}%` } }
                ];
            }
            
            // Filtro por data
            if (dataInicio || dataFim) {
                const { Op } = require('sequelize');
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
            console.error('Erro ao carregar colaborações:', error.message);
            res.status(500).render('error', {
                title: 'Erro - OuiWine',
                error: {
                    status: 500,
                    message: 'Erro ao carregar colaborações'
                }
            });
        }
    }

    static async store(req, res) {
        try {
            const { nome, email, cpf, mensagem } = req.body;
            const userId = req.session.userId;

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
                return res.redirect('/colaborar');
            }

            // Validar CPF
            const cpfLimpo = cpf.replace(/[^\d]/g, '');
            console.log('🔍 DEBUG - CPF limpo:', cpfLimpo);

            if (cpfLimpo.length !== 11 || !isValidCPF(cpfLimpo)) {
                req.flash('error', 'CPF inválido. Verifique os números digitados.');
                return res.redirect('/colaborar');
            }

            // Validar tamanho da mensagem
            const mensagemTrimmed = mensagem.trim();
            if (mensagemTrimmed.length < 10 || mensagemTrimmed.length > 500) {
                req.flash('error', 'A mensagem deve ter entre 10 e 500 caracteres.');
                return res.redirect('/colaborar');
            }

            // Buscar usuário atual
            const user = await User.findByPk(userId);
            if (!user) {
                req.flash('error', 'Usuário não encontrado. Faça login novamente.');
                return res.redirect('/auth/login');
            }

            console.log('🔍 DEBUG - Usuário encontrado:', user.nome);

            // Salvar CPF no User se ele não tiver
            if (!user.cpf) {
                try {
                    await user.update({ cpf: cpfLimpo });
                    console.log('✅ CPF salvo no usuário:', cpfLimpo);
                } catch (cpfError) {
                    console.error('⚠️ Erro ao salvar CPF no usuário:', cpfError.message);
                    // Continuar mesmo se não conseguir salvar CPF no User
                }
            } else {
                console.log('ℹ️ Usuário já possui CPF:', user.cpf);
            }

            // ✅ CRIAR COLABORAÇÃO (SEM VERIFICAÇÃO DE CPF DUPLICADO)
            // Agora permite múltiplas colaborações do mesmo usuário
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
            
            if (error.name === 'SequelizeValidationError') {
                const mensagem = error.errors.map(err => `${err.path}: ${err.message}`).join(', ');
                req.flash('error', `Erro de validação: ${mensagem}`);
            } else if (error.name === 'SequelizeForeignKeyConstraintError') {
                req.flash('error', 'Erro de relacionamento no banco. Faça login novamente.');
            } else {
                req.flash('error', `Erro interno: ${error.message}`);
            }
            
            res.redirect('/colaborar');
        }
    }
}

// Validação de CPF
function isValidCPF(cpf) {
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }

    let soma = 0;
    let resto;

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

module.exports = ColaboracaoController;