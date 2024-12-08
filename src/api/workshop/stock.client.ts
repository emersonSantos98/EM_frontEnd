import axios from '@axios'
import type { IQueryStock } from '@/views/apps/workshop/stock/types'
import ErrorMessage from '@/@core/utils/Error'

export default class StockClient {
  private readonly error: ErrorMessage

  constructor() {
    this.error = new ErrorMessage()
  }

  async findAll(query: IQueryStock) {
    try {
      return await axios.get('estoque', { params: query })
    }
    catch (err: any) {
      throw this.error.message(err, 'Não conseguimos listar os estoques')
    }
  }
  async findAllVariacoesSemEstoque(query: IQueryStock) {
    try {
      return await axios.get('estoque/variacoes/sem-estoque', { params: query })
    }
    catch (err: any) {
      throw this.error.message(err, 'Não conseguimos listar as variações sem estoque')
    }
  }

  async add(data: any) {
    try {
      return await axios.post('estoque/create', data)
    }
    catch (err: any) {
      throw this.error.message(err, 'Não conseguimos adicionar o estoque')
    }
  }
}
