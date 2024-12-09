import Notifier from '@core/utils/Notifier'

import MovementsStockClient from '@/api/workshop/movementsStock.client'
import type { IUseInventoryStore } from '@/views/apps/workshop/stock/inventoryMovementStore'
import { useInventoryStore } from '@/views/apps/workshop/stock/inventoryMovementStore'
import type { IQueryStock } from '@/views/apps/workshop/stock/types'

export default class MovementsStockService {
  public readonly client: MovementsStockClient
  public readonly notifier: Notifier
  public readonly store: IUseInventoryStore

  constructor() {
    this.client = new MovementsStockClient()
    this.notifier = new Notifier()
    this.store = useInventoryStore()
  }

  async findAllVariacoesSemEstoque(query: IQueryStock) {
    this.store.loadingMovements = true
    try {
      const res = await this.client.findAllMovimentacaoEstoque(query)

      this.store.movements = res.data.data
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
    finally {
      this.store.loadingMovements = false
    }
  }
}
