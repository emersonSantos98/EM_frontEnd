import axios from '@axios'
import type { IQueryStock, IStockMovementPayload } from '@/views/apps/workshop/stock/types'

import ErrorMessage from '@/@core/utils/Error'

export default class MovementsStockClient {
  private readonly error: ErrorMessage

  constructor() {
    this.error = new ErrorMessage()
  }

  async findAllMovimentacaoEstoque(query: IQueryStock) {
    try {
      return await axios.get('movimentacaoestoque', { params: query })
    }
    catch (err: any) {
      throw this.error.message(err, 'Não conseguimos listar as movimentações de estoque')
    }
  }

  async fetchSelectedEstoque() {
    try {
      return await axios.get('/estoque/variacoes/estoque')
    }
    catch (err: any) {
      throw this.error.message(err, 'Não conseguimos listar as movimentações de estoque')
    }
  }

  async addMovimentacaoEstoque(movement: IStockMovementPayload) {
    try {
      return await axios.post('/movimentacaoestoque/create', movement)
    }
    catch (err: any) {
      throw this.error.message(err, 'Não conseguimos adicionar a movimentação de estoque')
    }
  }
}
