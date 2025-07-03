'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

console.log('🔧 Inicializando models...');

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Importar models com tratamento de erro
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    try {
      console.log(`📦 Carregando model: ${file}`);
      
      const modelPath = path.join(__dirname, file);
      const modelFunction = require(modelPath);
      
      // Verificar se o require retornou uma função
      if (typeof modelFunction !== 'function') {
        console.log(`❌ ERRO: ${file} não exporta uma função válida`);
        console.log(`   Tipo retornado: ${typeof modelFunction}`);
        console.log(`   Valor: ${modelFunction}`);
        return;
      }
      
      const model = modelFunction(sequelize, Sequelize.DataTypes);
      
      // Verificar se o model foi criado corretamente
      if (!model || !model.name) {
        console.log(`❌ ERRO: ${file} não retornou um model válido`);
        console.log(`   Model: ${model}`);
        return;
      }
      
      console.log(`✅ Model ${model.name} carregado com sucesso`);
      db[model.name] = model;
      
    } catch (error) {
      console.log(`❌ ERRO ao carregar ${file}:`);
      console.log(`   ${error.message}`);
      console.log(`   Stack: ${error.stack}`);
    }
  });

// Executar associações com tratamento de erro
console.log('\n🔗 Configurando associações...');
Object.keys(db).forEach(modelName => {
  try {
    if (db[modelName] && typeof db[modelName].associate === 'function') {
      console.log(`🔗 Configurando associações para ${modelName}`);
      db[modelName].associate(db);
    } else {
      console.log(`ℹ️ ${modelName} não tem método associate (normal)`);
    }
  } catch (error) {
    console.log(`❌ ERRO ao configurar associações para ${modelName}:`);
    console.log(`   ${error.message}`);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log('✅ Models inicializados:', Object.keys(db).filter(key => !['sequelize', 'Sequelize'].includes(key)));

module.exports = db;