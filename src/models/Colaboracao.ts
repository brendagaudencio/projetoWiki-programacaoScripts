import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { IColaboracao } from '../types/colaboracao.interface';

// Definir atributos opcionais para criação
interface ColaboracaoCreationAttributes extends Optional<IColaboracao, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'userId'> {}

class Colaboracao extends Model<IColaboracao, ColaboracaoCreationAttributes> implements IColaboracao {
  public id!: number;
  public nome!: string;
  public email!: string;
  public cpf!: string;
  public mensagem!: string;
  public status!: 'pendente' | 'aprovada' | 'rejeitada';
  public userId?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método de associação
  public static associate(models: any): void {
    Colaboracao.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'SET NULL'
    });
  }
}

export default (sequelize: Sequelize): typeof Colaboracao => {
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
      defaultValue: 'aprovada',
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    // ADICIONAR TIMESTAMPS
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
      { fields: ['status'] },
      { fields: ['userId'] },
      { fields: ['createdAt'] },
      { fields: ['email'] },
      { fields: ['cpf'] }
    ]
  });

  return Colaboracao;
};

export { Colaboracao };