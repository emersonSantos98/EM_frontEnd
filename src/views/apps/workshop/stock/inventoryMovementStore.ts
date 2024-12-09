import { defineStore } from 'pinia'
import MovementsStockService from '@/services/workshop/movementsStock.service'

interface StockMovement {
  product: string
  variation: string // Exemplo: "Preto/M"
  quantity: number
  date: string
  type: 'Entrada' | 'Saída'
}

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    movements: [] as StockMovement[],
    loadingMovements: false,
  }),
  actions: {
    async fetchMovements() {
      await new MovementsStockService().findAllVariacoesSemEstoque({})
    },
  },
})

export interface IUseInventoryStore {
  movements: StockMovement[]
  fetchMovements: () => void
}
