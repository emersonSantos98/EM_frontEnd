import { defineStore } from 'pinia'
import Notifier from '@core/utils/Notifier'
import { findAll, generate_qr_code, remove } from '@/api/Product/product.client'

const notifier = new Notifier()
export const tableListProductStore = defineStore('tableListProductStore', {
  state: () => ({
    loading: false,
    tableProduct: [],
    filter: {},
    generateQrCodeUrl: null as string | null,
  }),

  actions: {
    async fetchTableData() {
      try {
        this.loading = true

        const response = await findAll(this.filter)

        this.tableProduct = response.data.data
      }
      catch (err) {
        notifier.error(`Error fetching table data: ${err.message}`)
      }
      finally {
        this.loading = false
      }
    },

    async deleteProduct(id: number) {
      try {
        this.loading = true

        const response = await remove(id)

        if (response.status === 200)
          notifier.success('Produto deletado com sucesso')
        else
          notifier.error('Erro ao deletar produto')
      }
      catch (err) {
        notifier.error(`Erro ao deletar produto: ${err.message}`)
      }
      finally {
        this.loading = false
      }
    },

    async generateQrCode(id: number, quantity: number) {
      try {
        this.loading = true

        const response = await generate_qr_code(id, quantity)

        const url = URL.createObjectURL(response.data)

        this.generateQrCodeUrl = url
      }
      catch (err) {
        notifier.error(`Erro ao gerar QR Code: ${err.message}`)
      }
      finally {
        this.loading = false
      }
    },

    clearGenerateQrCodeUrl() {
      this.generateQrCodeUrl = null
    },

    setFilter(filter: any) {
      this.filter = { ...this.filter, ...filter }
    },
    clearFilter() {
      this.filter = {}
    },
  },
})
