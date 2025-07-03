'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Colaboracoes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 100]
        }
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        validate: {
          isEmail: true,
          notEmpty: true
        }
      },
      cpf: {
        type: Sequelize.STRING(11),
        allowNull: false,
        // SEM UNIQUE - permite múltiplas colaborações do mesmo usuário
        validate: {
          notEmpty: true,
          len: [11, 11],
          isNumeric: true
        }
      },
      mensagem: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [10, 500]
        }
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'aprovada',
        validate: {
          isIn: [['pendente', 'aprovada', 'rejeitada']]
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    // Índices para performance (SEM unique no CPF)
    await queryInterface.addIndex('Colaboracoes', ['userId'], {
      name: 'colaboracoes_user_id'
    });

    await queryInterface.addIndex('Colaboracoes', ['status'], {
      name: 'colaboracoes_status'
    });

    await queryInterface.addIndex('Colaboracoes', ['createdAt'], {
      name: 'colaboracoes_created_at'
    });

    await queryInterface.addIndex('Colaboracoes', ['email'], {
      name: 'colaboracoes_email'
    });

    // Índice de performance no CPF (mas não unique)
    await queryInterface.addIndex('Colaboracoes', ['cpf'], {
      name: 'colaboracoes_cpf_performance'
    });

    console.log('✅ Tabela Colaboracoes criada sem constraint UNIQUE no CPF');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Colaboracoes');
  }
};