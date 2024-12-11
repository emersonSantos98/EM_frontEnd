import { defineStore } from 'pinia'
import MovementsStockService from '@/services/workshop/movementsStock.service'
import type { IStockMovementPayload } from '@/views/apps/workshop/stock/types'

interface StockMovement {
  product: string
  variation: string // Exemplo: "Preto/M"
  quantity: number
  date: string
  tipo: 'Entrada' | 'Saída'
}

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    movements: [] as StockMovement[],
    loadingMovements: false,
    list: [] as any[],
  }),
  actions: {
    async fetchMovements() {
      await new MovementsStockService().findAllVariacoesSemEstoque({})
    },
    async fetchSelectedEstoque() {
      await new MovementsStockService().fetchSelectedEstoque()
    },
    async addMovement(movement: IStockMovementPayload) {
      await new MovementsStockService().addMovement(movement)
    },
  },
})

export interface IUseInventoryStore {
  movements: StockMovement[]
  fetchMovements: () => void
  loadingMovements: boolean
  list: any[]
}
