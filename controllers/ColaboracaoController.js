// controllers/ColaboracaoController.js - VERSÃO FINAL COM CPF OBRIGATÓRIO

const { Colaboracao } = require('../models');

class ColaboracaoController {
    
    // 📋 Mostrar formulário de colaboração (apenas para usuários logados)
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

    // 📋 Listar colaborações aprovadas (página pública)
    static async index(req, res) {
        try {
            // Parâmetros de filtro da query string
            const { busca, dataInicio, dataFim } = req.query;
            
            // Montar condições de busca
            const whereConditions = { status: 'aprovada' };
            
            // Filtro por palavra-chave (nome ou mensagem)
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

    // 💾 Salvar nova colaboração (apenas usuários logados)
    static async store(req, res) {
        try {
            const { nome, email, cpf, mensagem } = req.body;
            const userId = req.session.userId;

            console.log('📝 Nova colaboração recebida:', { 
                userId, 
                nome: nome ? 'PRESENTE' : 'AUSENTE',
                email: email ? 'PRESENTE' : 'AUSENTE',
                cpf: cpf ? 'PRESENTE' : 'AUSENTE',
                mensagem: mensagem ? `${mensagem.length} chars` : 'AUSENTE'
            });

            // ✅ VALIDAÇÕES OBRIGATÓRIAS
            
            // 1. Validar presença dos campos
            if (!nome || !email || !cpf || !mensagem) {
                req.flash('error', 'Todos os campos são obrigatórios.');
                return res.redirect('/colaborar');
            }

            // 2. Validar CPF
            const cpfLimpo = cpf.replace(/[^\d]/g, '');
            if (cpfLimpo.length !== 11) {
                req.flash('error', 'CPF deve ter 11 dígitos.');
                return res.redirect('/colaborar');
            }

            if (!isValidCPF(cpfLimpo)) {
                req.flash('error', 'CPF inválido. Verifique os números digitados.');
                return res.redirect('/colaborar');
            }

            // 3. Validar tamanho da mensagem (10-500 caracteres)
            const mensagemTrimmed = mensagem.trim();
            if (mensagemTrimmed.length < 10) {
                req.flash('error', 'A mensagem deve ter pelo menos 10 caracteres.');
                return res.redirect('/colaborar');
            }

            if (mensagemTrimmed.length > 500) {
                req.flash('error', 'A mensagem deve ter no máximo 500 caracteres.');
                return res.redirect('/colaborar');
            }

            // 4. Verificar se usuário já tem colaboração (opcional - evitar spam)
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

            // ✅ CRIAR COLABORAÇÃO
            const novaColaboracao = await Colaboracao.create({
                nome: nome.trim(),
                email: email.toLowerCase().trim(),
                cpf: cpfLimpo,
                mensagem: mensagemTrimmed,
                status: 'aprovada', // Auto-aprovar por enquanto
                userId: userId // Associar ao usuário logado
            });

            console.log(`✅ Colaboração criada com sucesso! ID: ${novaColaboracao.id}`);

            req.flash('success', `Obrigado, ${nome.split(' ')[0]}! Sua história foi compartilhada com sucesso. 🍷`);
            res.redirect('/colaboracoes');

        } catch (error) {
            console.error('❌ Erro ao salvar colaboração:', error.message);
            
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

    // 🧪 Debug de colaborações (apenas para desenvolvimento)
    static async debug(req, res) {
        try {
            const total = await Colaboracao.count();
            const colaboracoes = await Colaboracao.findAll({
                order: [['createdAt', 'DESC']],
                limit: 10,
                attributes: ['id', 'nome', 'email', 'cpf', 'status', 'createdAt', 'userId']
            });

            res.json({
                message: 'Debug de colaborações',
                total: total,
                colaboracoes: colaboracoes.map(c => ({
                    id: c.id,
                    nome: c.nome,
                    email: c.email,
                    cpf: c.cpf ? '***.***.***-**' : null, // Mascarar CPF no debug
                    status: c.status,
                    userId: c.userId,
                    mensagem: c.mensagem ? c.mensagem.substring(0, 50) + '...' : null,
                    createdAt: c.createdAt
                }))
            });

        } catch (error) {
            res.status(500).json({ 
                error: error.message
            });
        }
    }
}

// ✅ FUNÇÃO DE VALIDAÇÃO DE CPF (backend)
function isValidCPF(cpf) {
    // Eliminar CPFs conhecidos como inválidos
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }

    // Validar primeiro dígito verificador
    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    // Validar segundo dígito verificador
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf.substring(10, 11));
}

module.exports = ColaboracaoController;