'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
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
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true
        }
      },
      senha_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      ativo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      cpf: {
        type: Sequelize.STRING(11),
        allowNull: true,
        validate: {
          len: [11, 11],
          isNumeric: true
        }
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
    
    // Índices para performance
    await queryInterface.addIndex('Users', ['email'], {
      name: 'users_email_unique',
      unique: true
    });
    
    await queryInterface.addIndex('Users', ['cpf'], {
      name: 'users_cpf_index'
    });

    console.log('✅ Tabela Users criada com CPF incluído');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};