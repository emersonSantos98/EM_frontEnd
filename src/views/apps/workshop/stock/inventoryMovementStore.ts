import { defineStore } from 'pinia'

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
  }),
  actions: {
    fetchMovements() {
      this.movements = [
        { product: 'Camisa', variation: 'Preto/M', quantity: 20, date: '2024-12-01', type: 'Entrada' },
        { product: 'Camisa', variation: 'Preto/G', quantity: 10, date: '2024-12-02', type: 'Saída' },
        { product: 'Camisa', variation: 'Vermelho/M', quantity: 15, date: '2024-12-03', type: 'Entrada' },
        { product: 'Camisa', variation: 'Vermelho/G', quantity: 5, date: '2024-12-04', type: 'Saída' },
      ]
    },
  },
})
