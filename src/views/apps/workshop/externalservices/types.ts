export interface PartnerType {
  name: string
  whatsapp?: string
  status: 'ativo' | 'inativo'
  recebedor?: string
  cep?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
  tipo: 'costureira' | 'oficina' | 'fornecedor'
}

export interface IQueryPartner {
  tipo: 'costureira' | 'oficina' | 'fornecedor'
  limit: number
  page: number
  status: 'ativo' | 'inativo'
}
