export interface ProductType {
  nome: string
  descricao: string
  sku: string
  status: string
  cor: string
  imagem: string
}

export interface IQueryVariation {
  id: string
  tamanho: string
  estampa: string
  estoque: number
  sku: string
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


export interface VariationType {
  id: string
  produtoId: string
  tamanho: string
  estampa: string
  sku: string
  estoque: number
}
