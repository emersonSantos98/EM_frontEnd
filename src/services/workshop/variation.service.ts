import Notifier from '@core/utils/Notifier'

import VariationClient from '@/api/workshop/variation.client'
import { useProductStore } from '@/views/apps/workshop/product/useProduct'

export default class VariationService {
  public readonly client: VariationClient
  public readonly notifier: Notifier
  public readonly store: ReturnType<typeof useProductStore>
  constructor() {
    this.client = new VariationClient()
    this.notifier = new Notifier()
    this.store = useProductStore()
  }

  async deleteVariation(id: string) {
    this.store.loadingProducts = true
    try {
      await this.client.delete(id)
      this.notifier.success('Produto deletado com sucesso!')
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
    finally {
      this.store.loadingProducts = false
    }
  }
}
