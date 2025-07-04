export interface IUser {
  id: number;
  nome: string;
  email: string;
  senha_hash: string;
  ativo: boolean;
  cpf?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreation {
  nome: string;
  email: string;
  senha_hash: string;
  ativo?: boolean;
  cpf?: string;
}

export interface IUserLogin {
  email: string;
  senha: string;
}

export interface IUserRegister {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}