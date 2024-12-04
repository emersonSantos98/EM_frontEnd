import Notifier from '@core/utils/Notifier'

import ProductClient from '@/api/workshop/product.client'
import type { IUseProductStore } from '@/views/apps/workshop/product/useProduct'
import { useProductStore} from '@/views/apps/workshop/product/useProduct'
import type { ProductType, IQueryVariation } from '@/views/apps/workshop/product/types'

export default class ProductService {
  public readonly client: ProductClient
  public readonly notifier: Notifier
  public readonly store: IUseProductStore

  constructor() {
    this.client = new ProductClient()
    this.notifier = new Notifier()
    this.store = useProductStore()
  }

  async findAllProduct() {
    this.store.loadingProducts = true
    try {
      const res = await this.client.findAll()

      this.store.products = res.data.data

      this.notifier.success('Produto carregados com sucesso!')
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
    finally {
      this.store.loadingProducts = false
    }
  }

  async findOneProduct(id: string) {
    this.store.loadingProducts = true
    try {
      const res = await this.client.findOne(id)

      this.store.findOne = res.data.data
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
    finally {
      this.store.loadingProducts = false
    }
  }

  async addProduct(productData: { produto: ProductType; variacoes: IQueryVariation[] }) {
    this.store.loadingProducts = true
    try {
      await this.client.create(productData)

      this.notifier.success('Produto adicionado com sucesso!')
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
    finally {
      this.store.loadingProducts = false
    }
  }

  async updateProduct(id: string, partner: ProductType) {
    this.store.loadingProducts = true
    try {
      await this.client.update(id, partner)

      const index = this.store.products.rows.findIndex(p => p.id === partner)
      if (index !== -1)
        this.store.products.rows[index] = { ...this.store.products.rows[index], ...partner }

      this.notifier.success('Produto atualizado com sucesso!')
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
    finally {
      this.store.loadingProducts = false
    }
  }

  async deleteProduct(id: string) {
    this.store.loadingProducts = true
    try {
      await this.client.delete(id)
      this.store.products = this.store.products.rows.filter(p => p.id !== id)

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

