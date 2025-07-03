'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Associações serão adicionadas aqui futuramente
      console.log('🔗 User.associate chamado (sem associações por enquanto)');
    }
  }
  
  User.init({
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    senha_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true
  });

  console.log('✅ Model User inicializado corretamente');
  return User;
};