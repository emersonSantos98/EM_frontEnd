export interface IQueryStock {
  colaboradorId: string
  status: 'ativo' | 'inativo'
  limit: number
  page: number
}


export interface IStockMovementPayload {
  tipo: 'entrada' | 'saida'
  quantidade: number
  descricao: string
  estoqueId: string
  dataMovimentacao: string
}
