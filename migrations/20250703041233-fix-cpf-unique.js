'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('🔧 Aplicando correção permanente do CPF...');
    
    // Remover TODOS os índices UNIQUE do CPF que possam existir
    const uniqueIndexes = [
      'colaboracoes_cpf_unique',
      'colaboracoes_cpf', 
      'Colaboracoes_cpf_unique',
      'Colaboracoes_cpf'
    ];

    for (const indexName of uniqueIndexes) {
      try {
        await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ${indexName}`);
        console.log(`   ✅ Removido índice: ${indexName}`);
      } catch (error) {
        console.log(`   ℹ️ Índice ${indexName} não encontrado`);
      }
    }

    // Garantir que existe apenas índice de performance (não-unique)
    try {
      // Verificar se já existe
      const [results] = await queryInterface.sequelize.query(`
        SELECT name FROM sqlite_master 
        WHERE type='index' AND name='colaboracoes_cpf_performance'
      `);

      if (results.length === 0) {
        await queryInterface.addIndex('Colaboracoes', ['cpf'], {
          name: 'colaboracoes_cpf_performance',
          unique: false
        });
        console.log('   ✅ Criado índice de performance (não-unique)');
      } else {
        console.log('   ℹ️ Índice de performance já existe');
      }
    } catch (error) {
      console.log('   ⚠️ Erro ao criar índice de performance:', error.message);
    }

    // Verificar estado final
    const [finalIndexes] = await queryInterface.sequelize.query(`
      SELECT name FROM sqlite_master 
      WHERE type='index' AND tbl_name='Colaboracoes' AND name LIKE '%cpf%'
    `);
    
    console.log('📋 Índices do CPF após correção:');
    finalIndexes.forEach(index => {
      console.log(`   - ${index.name}`);
    });

    console.log('✅ Correção permanente aplicada');
  },

  async down(queryInterface, Sequelize) {
    // Para reverter, não fazer nada - manter correção
    console.log('ℹ️ Correção permanente mantida (não revertida)');
  }
};