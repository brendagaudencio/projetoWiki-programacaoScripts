export interface IColaboracao {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  mensagem: string;
  status: 'pendente' | 'aprovada' | 'rejeitada';
  userId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IColaboracaoCreation {
  nome: string;
  email: string;
  cpf: string;
  mensagem: string;
  status?: 'pendente' | 'aprovada' | 'rejeitada';
  userId?: number;
}

export interface IColaboracaoFilter {
  busca?: string;
  dataInicio?: string;
  dataFim?: string;
}