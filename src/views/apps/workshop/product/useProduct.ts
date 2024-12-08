import { defineStore } from 'pinia'
import type { IQueryProduct, IQueryVariation, ProductType } from './types'
import ProductService from '@/services/workshop/product.service'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: {
      count: 0,
      produtos: [] as ProductType[],
    },
    loadingProducts: false,
    findOne: null as ProductType | null,
  }),
  actions: {
    async addProduct(productData: { produto: ProductType; variacoes: IQueryVariation[] }) {
      try {
        await new ProductService().addProduct(productData)
        this.products.produtos.push(productData.produto)
      }
      catch (error) {
        console.error('Erro ao adicionar produto:', error)
      }
    },
    async findAllProduct(query: IQueryProduct) {
      this.loadingProducts = true
      try {
        await new ProductService().findAllProduct(query)
      }
      catch (error) {
        console.error('Erro ao buscar produtos:', error)
      }
      this.loadingProducts = false
    },
    async deleteProduct(id: number) {
      try {
        await new ProductService().deleteProduct(id)
      }
      catch (error) {
        console.error('Erro ao deletar produto:', error)
      }
    },

  },
})

export interface IUseProductStore {
  products: {
    count: number
    produtos: ProductType[]
  }
  loadingProducts: boolean
  addProduct: (partner: ProductType) => Promise<void>

}
