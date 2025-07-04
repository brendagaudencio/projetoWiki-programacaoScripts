import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '../../config/config.json'))[env];

interface DB {
  [key: string]: any;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}

const db: DB = {
  sequelize: {} as Sequelize,
  Sequelize
};

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Importar models
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.ts' || file.slice(-3) === '.js');
  })
  .forEach(file => {
    try {
      const modelPath = path.join(__dirname, file);
      const modelFunction = require(modelPath).default;
      
      if (typeof modelFunction !== 'function') {
        console.error(`Erro: ${file} não exporta uma função válida`);
        return;
      }
      
      const model = modelFunction(sequelize, DataTypes);
      
      if (!model || !model.name) {
        console.error(`Erro: ${file} não retornou um model válido`);
        return;
      }
      
      db[model.name] = model;
      
    } catch (error) {
      console.error(`Erro ao carregar ${file}: ${(error as Error).message}`);
    }
  });

// Configurar associações
Object.keys(db).forEach(modelName => {
  try {
    if (db[modelName] && typeof db[modelName].associate === 'function') {
      db[modelName].associate(db);
    }
  } catch (error) {
    console.error(`Erro ao configurar associações para ${modelName}: ${(error as Error).message}`);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
export { sequelize, Sequelize };