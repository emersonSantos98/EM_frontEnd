export interface IQueryStock {
  colaboradorId: string
  status: 'ativo' | 'inativo'
  limit: number
  page: number
}
