// productStore.ts
import { defineStore } from 'pinia'
import type { ProductData } from './types'
import Notifier from '@core/utils/Notifier'
import { create } from '@/api/Product/product.client'

const notifier = new Notifier()
export const useProductStore = defineStore('productStore', {
  state: () => ({
    loading: false,
  }),

  actions: {
    async create(data: ProductData) {
      try {
        this.loading = true

        const formData = new FormData()

        formData.append('name_product', data.name_product)
        formData.append('description', data.description)
        formData.append('variations', JSON.stringify(data.variations))

        const response = await create(formData)

        if (response.status === 201)
          notifier.success('Produto criado com sucesso')
        else
          notifier.error('Erro ao criar produto')
      }
      catch (err) {
        notifier.error(`Erro ao criar produto: ${err.message}`)
      }
      finally {
        this.loading = false
      }
    },
  },
})
