import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { IUser } from '../types/user.interface';

// Definir atributos opcionais para criação
interface UserCreationAttributes extends Optional<IUser, 'id' | 'createdAt' | 'updatedAt' | 'ativo' | 'cpf'> {}

class User extends Model<IUser, UserCreationAttributes> implements IUser {
  public id!: number;
  public nome!: string;
  public email!: string;
  public senha_hash!: string;
  public ativo!: boolean;
  public cpf?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método de associação
  public static associate(models: any): void {
    User.hasMany(models.Colaboracao, {
      foreignKey: 'userId',
      as: 'colaboracoes'
    });
  }

  // Validação de CPF - TORNAR PÚBLICO STATIC
  public static isValidCPFNumber(cpf: string): boolean {
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      return false;
    }

    let soma = 0;
    let resto: number;

    // Primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    // Segundo dígito verificador
    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf.substring(10, 11));
  }
}

export default (sequelize: Sequelize): typeof User => {
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    senha_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    cpf: {
      type: DataTypes.STRING(11),
      allowNull: true,
      validate: {
        len: [11, 11],
        isNumeric: true,
        isValidCPF(value: string) {
          if (value && !User.isValidCPFNumber(value)) {
            throw new Error('CPF inválido');
          }
        }
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
    modelName: 'User',
    tableName: 'Users',
    timestamps: true
  });

  return User;
};

export { User };