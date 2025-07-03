// consolidate-migrations.js - Script para consolidar migrations

const fs = require('fs');
const path = require('path');

async function consolidateMigrations() {
    console.log('🔄 Iniciando consolidação de migrations...');
    
    try {
        // 1. Verificar se migrations_backup existe
        if (!fs.existsSync('migrations_backup')) {
            console.log('❌ Execute primeiro: cp -r migrations/ migrations_backup/');
            return;
        }

        // 2. Remover migrations antigas
        const oldMigrations = [
            '20250629061909-create-users.js',
            '20250629062242-create-colaboracoes.js', 
            '20250703032956-add-cpf-to-users.js',
            '20250703034302-remove-unique-cpf-colaboracoes.js'
        ];

        console.log('🗑️ Removendo migrations antigas...');
        oldMigrations.forEach(file => {
            const filePath = path.join('migrations', file);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`   ❌ Removido: ${file}`);
            }
        });

        // 3. Gerar timestamps para novas migrations
        const now = new Date();
        const timestamp1 = now.toISOString().replace(/[-T:]/g, '').substring(0, 14);
        
        // Segunda migration 1 minuto depois
        const later = new Date(now.getTime() + 60000);
        const timestamp2 = later.toISOString().replace(/[-T:]/g, '').substring(0, 14);

        // 4. Criar nomes de arquivos
        const usersFile = `${timestamp1}-create-users-final.js`;
        const colaboracoesFile = `${timestamp2}-create-colaboracoes-final.js`;

        console.log('📝 Criando migrations consolidadas...');
        console.log(`   ✅ ${usersFile}`);
        console.log(`   ✅ ${colaboracoesFile}`);

        // 5. Conteúdo das migrations (seria copiado dos artifacts)
        console.log('');
        console.log('🔄 PRÓXIMOS PASSOS MANUAIS:');
        console.log('1. Copie o conteúdo do artifact "01-create-users-final.js"');
        console.log(`   para: migrations/${usersFile}`);
        console.log('');
        console.log('2. Copie o conteúdo do artifact "02-create-colaboracoes-final.js"');
        console.log(`   para: migrations/${colaboracoesFile}`);
        console.log('');
        console.log('3. Execute: rm database.sqlite');
        console.log('4. Execute: npx sequelize-cli db:migrate');
        console.log('5. Execute: npm run dev');
        
        // Criar arquivos vazios para facilitar
        fs.writeFileSync(`migrations/${usersFile}`, '// Copie conteúdo do artifact 01-create-users-final.js aqui');
        fs.writeFileSync(`migrations/${colaboracoesFile}`, '// Copie conteúdo do artifact 02-create-colaboracoes-final.js aqui');

        console.log('');
        console.log('✅ Arquivos criados! Agora copie o conteúdo dos artifacts.');

    } catch (error) {
        console.error('❌ Erro na consolidação:', error.message);
    }
}

consolidateMigrations();