// stores/stockStore.ts
import { defineStore } from 'pinia'
import type { IQueryStock } from '../stock/types'
import type { ProductType } from '../product/types'
import StockService from '@/services/workshop/stock.service'

export const useStockStore = defineStore('stockStore', {
  state: () => ({
    loadingStock: false,
    products: {
      count: 0,
      produtos: [] as ProductType[],
    },
    variacoesSemEstoque: {
      count: 0,
      produtos: [] as ProductType[],
    },
  }),

  actions: {
    async fetchStock(query: IQueryStock) {
      try {
        await new StockService().findAllStock(query)
      }
      catch (error) {
        console.error('Erro ao buscar Stock:', error)
      }
    },
    async fetchVariacoesSemEstoque(query: IQueryStock) {
      try {
        await new StockService().findAllVariacoesSemEstoque(query)
      }
      catch (error) {
        console.error('Erro ao buscar Variações sem Estoque:', error)
      }
    },
    async addStock(data: ProductType) {
      try {
        await new StockService().addStock(data)
      }
      catch (error) {
        console.error('Erro ao adicionar Stock:', error)
      }
    },
  },
})

export interface IUseStockStore {
  loadingStock: boolean
  products: {
    count: number
    produtos: ProductType[]
  }
  variacoesSemEstoque: {
    count: number
    produtos: ProductType[]
  }
  fetchStock: () => Promise<void>
  fetchVariacoesSemEstoque: () => Promise<void>
  addStock: (data: ProductType) => Promise<void>
}
