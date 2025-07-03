const { Colaboracao } = require('../models');

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

            // Validações obrigatórias
            if (!nome || !email || !cpf || !mensagem) {
                req.flash('error', 'Todos os campos são obrigatórios.');
                return res.redirect('/colaborar');
            }

            // Validar CPF
            const cpfLimpo = cpf.replace(/[^\d]/g, '');
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

            // Verificar colaboração existente
            const colaboracaoExistente = await Colaboracao.findOne({
                where: { 
                    email: email.toLowerCase().trim(),
                    status: 'aprovada'
                }
            });

            if (colaboracaoExistente) {
                req.flash('error', 'Você já possui uma colaboração aprovada. Entre em contato conosco para enviar uma nova história.');
                return res.redirect('/colaboracoes');
            }

            // Criar colaboração
            await Colaboracao.create({
                nome: nome.trim(),
                email: email.toLowerCase().trim(),
                cpf: cpfLimpo,
                mensagem: mensagemTrimmed,
                status: 'aprovada',
                userId: userId
            });

            req.flash('success', `Obrigado, ${nome.split(' ')[0]}! Sua história foi compartilhada com sucesso.`);
            res.redirect('/colaboracoes');

        } catch (error) {
            console.error('Erro ao salvar colaboração:', error.message);
            
            if (error.name === 'SequelizeValidationError') {
                const mensagem = error.errors.map(err => err.message).join(', ');
                req.flash('error', mensagem);
            } else if (error.name === 'SequelizeUniqueConstraintError') {
                req.flash('error', 'Este CPF já foi utilizado em outra colaboração.');
            } else {
                req.flash('error', 'Erro interno. Tente novamente em alguns minutos.');
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