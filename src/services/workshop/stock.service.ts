import Notifier from '@core/utils/Notifier'

import StockClient from '@/api/workshop/stock.client'
import type { IUseStockStore } from '@/views/apps/workshop/stock/stockStore'
import { useStockStore } from '@/views/apps/workshop/stock/stockStore'
import type { IQueryStock } from '@/views/apps/workshop/stock/types'

export default class StockService {
  public readonly client: StockClient
  public readonly notifier: Notifier
  public readonly store: IUseStockStore

  constructor() {
    this.client = new StockClient()
    this.notifier = new Notifier()
    this.store = useStockStore()
  }

  async findAllStock(query: IQueryStock) {
    this.store.loadingStock = true
    try {
      const res = await this.client.findAll(query)

      this.store.products = res.data.data
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
    finally {
      this.store.loadingStock = false
    }
  }

  async findAllVariacoesSemEstoque(query: IQueryStock) {
    this.store.loadingStock = true
    try {
      const res = await this.client.findAllVariacoesSemEstoque(query)

      this.store.variacoesSemEstoque = res.data.data
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
    finally {
      this.store.loadingStock = false
    }
  }

  async addStock(data: any) {
    try {
      await this.client.add(data)
      this.notifier.success('Estoque adicionado com sucesso')
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
  }
}
