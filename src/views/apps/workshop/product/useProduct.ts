import { defineStore } from 'pinia'
import type { IQueryVariation, ProductType } from './types'
import ProductService from '@/services/workshop/product.service'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: {
      count: 0,
      rows: [] as ProductType[],
    },
    loadingProducts: false,
    findOne: null as ProductType | null,
  }),
  actions: {
    async addProduct(productData: { produto: ProductType; variacoes: IQueryVariation[] }) {
      try {
        await new ProductService().addProduct(productData)
        this.products.rows.push(productData.produto)
      }
      catch (error) {
        console.error('Erro ao adicionar produto:', error)
      }
    },

  },
})

export interface IUseProductStore {
  products: {
    count: number
    rows: ProductType[]
  }
  loadingProducts: boolean
  addProduct: (partner: ProductType) => Promise<void>

}
