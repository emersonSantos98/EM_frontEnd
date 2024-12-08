export interface ProductType {
  id: string
  nome: string
  descricao: string
  sku: string
  status: string
}

export interface IQueryVariation {
  id: string
  tamanho: string
  cor: string
}

export interface IQueryProduct {
  search: string
  limit: number
  page: number
  status: 'ativo' | 'inativo'
}

export interface IQueryStock {
  colaboradorId: string
  status: 'ativo' | 'inativo'
  limit: number
  page: number
}
