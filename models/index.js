'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Importar models
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    try {
      const modelPath = path.join(__dirname, file);
      const modelFunction = require(modelPath);
      
      if (typeof modelFunction !== 'function') {
        console.error(`Erro: ${file} não exporta uma função válida`);
        return;
      }
      
      const model = modelFunction(sequelize, Sequelize.DataTypes);
      
      if (!model || !model.name) {
        console.error(`Erro: ${file} não retornou um model válido`);
        return;
      }
      
      db[model.name] = model;
      
    } catch (error) {
      console.error(`Erro ao carregar ${file}: ${error.message}`);
    }
  });

// Configurar associações
Object.keys(db).forEach(modelName => {
  try {
    if (db[modelName] && typeof db[modelName].associate === 'function') {
      db[modelName].associate(db);
    }
  } catch (error) {
    console.error(`Erro ao configurar associações para ${modelName}: ${error.message}`);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;