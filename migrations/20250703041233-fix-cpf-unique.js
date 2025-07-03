'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remover índices UNIQUE do CPF
    const uniqueIndexes = [
      'colaboracoes_cpf_unique',
      'colaboracoes_cpf', 
      'Colaboracoes_cpf_unique',
      'Colaboracoes_cpf'
    ];

    for (const indexName of uniqueIndexes) {
      try {
        await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ${indexName}`);
      } catch (error) {
        // Índice não encontrado
      }
    }

    // Criar índice de performance (não-unique)
    try {
      const [results] = await queryInterface.sequelize.query(`
        SELECT name FROM sqlite_master 
        WHERE type='index' AND name='colaboracoes_cpf_performance'
      `);

      if (results.length === 0) {
        await queryInterface.addIndex('Colaboracoes', ['cpf'], {
          name: 'colaboracoes_cpf_performance',
          unique: false
        });
      }
    } catch (error) {
      console.error('Erro ao criar índice de performance:', error.message);
    }
  },

  async down(queryInterface, Sequelize) {
    // Manter correção (não reverter)
  }
};