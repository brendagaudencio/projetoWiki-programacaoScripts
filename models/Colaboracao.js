// models/Colaboracao.js - COM CAMPO USERID

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Colaboracao extends Model {
    static associate(models) {
      // ✅ ASSOCIAÇÃO COM USER
      Colaboracao.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'author',
        onDelete: 'SET NULL' // Se usuário for deletado, colaboração permanece
      });
    }
  }

  Colaboracao.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Nome é obrigatório'
        },
        len: {
          args: [2, 100],
          msg: 'Nome deve ter entre 2 e 100 caracteres'
        }
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Email é obrigatório'
        },
        isEmail: {
          msg: 'Email deve ter formato válido'
        }
      }
    },
    cpf: {
      type: DataTypes.STRING(11),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'CPF é obrigatório'
        },
        len: {
          args: [11, 11],
          msg: 'CPF deve ter 11 dígitos'
        },
        isNumeric: {
          msg: 'CPF deve conter apenas números'
        }
      }
    },
    mensagem: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Mensagem é obrigatória'
        },
        len: {
          args: [10, 500],
          msg: 'Mensagem deve ter entre 10 e 500 caracteres'
        }
      }
    },
    status: {
      type: DataTypes.ENUM('pendente', 'aprovada', 'rejeitada'),
      defaultValue: 'aprovada', // Auto-aprovar por enquanto
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Pode ser null para colaborações anônimas antigas
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Colaboracao',
    tableName: 'colaboracoes',
    timestamps: true,
    indexes: [
      {
        fields: ['status']
      },
      {
        fields: ['userId']
      },
      {
        fields: ['createdAt']
      },
      {
        fields: ['email']
      },
      {
        unique: true,
        fields: ['cpf'] // CPF único no sistema
      }
    ]
  });

  return Colaboracao;
};