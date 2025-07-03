'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Colaboracoes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      nome: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      cpf: {
        type: Sequelize.STRING(14),
        allowNull: false,
        comment: 'CPF no formato XXX.XXX.XXX-XX'
      },
      mensagem: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pendente', 'aprovada', 'rejeitada'),
        defaultValue: 'pendente',
        allowNull: false
      },

      // 🔗 Foreign key para Users
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', // Atenção: o nome da tabela referenciada é case-sensitive
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Criar índices para performance
    await queryInterface.addIndex('Colaboracoes', ['status']);
    await queryInterface.addIndex('Colaboracoes', ['email']);
    await queryInterface.addIndex('Colaboracoes', ['createdAt']);
    await queryInterface.addIndex('Colaboracoes', ['userId']);
    await queryInterface.addIndex('Colaboracoes', ['cpf'], {
      unique: true,
      name: 'colaboracoes_cpf_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Colaboracoes');
  }
};
