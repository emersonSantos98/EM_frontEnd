import axios from '@axios'
import type { IQueryStock } from '@/views/apps/workshop/stock/types'
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
}
