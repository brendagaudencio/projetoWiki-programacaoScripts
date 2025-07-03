// seeds/admin-seeder.js - VERSÃO CORRIGIDA

const bcrypt = require('bcryptjs');
const { User } = require('../models');

async function adminSeeder() {
    console.log('🌱 === ADMIN SEEDER INICIADO ===');
    
    try {
        const adminEmail = 'admin@ouiwine.com';
        const adminSenha = 'admin123';
        
        console.log('🔍 Verificando se admin já existe...');
        
        // Verificar se admin já existe
        let adminUser = await User.findOne({ 
            where: { email: adminEmail } 
        });
        
        if (adminUser) {
            console.log('👤 Admin encontrado:', adminUser.nome);
            console.log('📧 Email:', adminUser.email);
            console.log('🔐 Senha existe:', !!adminUser.senha);
            console.log('🔐 Tamanho senha:', adminUser.senha ? adminUser.senha.length : 0);
            
            // Se admin existe mas sem senha, atualizar
            if (!adminUser.senha || adminUser.senha.length === 0) {
                console.log('🔧 Admin sem senha - ATUALIZANDO...');
                
                const senhaHash = await bcrypt.hash(adminSenha, 10);
                console.log('🔐 Hash gerado:', senhaHash.substring(0, 20) + '...');
                
                await adminUser.update({ senha: senhaHash });
                
                console.log('✅ Senha do admin ATUALIZADA com sucesso!');
                
                // Verificar se atualizou
                const adminAtualizado = await User.findOne({ where: { email: adminEmail } });
                console.log('✅ Verificação: nova senha existe:', !!adminAtualizado.senha);
                
            } else {
                console.log('✅ Admin já tem senha válida');
            }
            
        } else {
            console.log('👤 Admin não existe - CRIANDO...');
            
            // Criar hash da senha
            console.log('🔐 Gerando hash da senha...');
            const senhaHash = await bcrypt.hash(adminSenha, 10);
            console.log('🔐 Hash gerado:', senhaHash.substring(0, 20) + '...');
            
            // Criar admin
            const novoAdmin = await User.create({
                nome: 'Administrador OuiWine',
                email: adminEmail,
                senha: senhaHash
            });
            
            console.log('✅ Admin criado com sucesso!');
            console.log('   ID:', novoAdmin.id);
            console.log('   Nome:', novoAdmin.nome);
            console.log('   Email:', novoAdmin.email);
            console.log('   Senha existe:', !!novoAdmin.senha);
        }
        
        // Teste final da senha
        console.log('\n🧪 TESTE FINAL:');
        const adminFinal = await User.findOne({ where: { email: adminEmail } });
        
        if (adminFinal && adminFinal.senha) {
            const senhaCorreta = await bcrypt.compare(adminSenha, adminFinal.senha);
            console.log('🔐 Teste de login admin123:', senhaCorreta ? '✅ SUCESSO' : '❌ FALHOU');
        } else {
            console.log('❌ Admin ainda sem senha após seeder!');
        }
        
        console.log('🌱 === ADMIN SEEDER FINALIZADO ===\n');
        
    } catch (error) {
        console.error('❌ Erro no admin seeder:', error);
        throw error;
    }
}

module.exports = adminSeeder;