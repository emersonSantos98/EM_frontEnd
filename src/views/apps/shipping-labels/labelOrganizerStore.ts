import { defineStore } from 'pinia'
import { PDFDocument } from 'pdf-lib'
import { generateShippingLabels } from '@/api/ShippingLabels/shipping-labels.client'
import Notifier from '@core/utils/Notifier'

const notifier = new Notifier()

export const useLabelOrganizerStore = defineStore('LabelOrganizerStore', {
  state: () => ({
    loading: false,
    generatedLabelUrl: null as string | null,
    countpagesEconomic: 0,
    countPages: 0,
  }),
  actions: {
    async generateShippingLabels(params: FormData) {
      this.loading = true
      try {
        const response = await generateShippingLabels(params)
        const uint8Array = new Uint8Array(await response.arrayBuffer())

        const pdfDoc = await PDFDocument.load(uint8Array)

        this.countpagesEconomic = pdfDoc.getPageCount()

        const url = URL.createObjectURL(response)

        this.generatedLabelUrl = url
        notifier.success('Shipping labels generated successfully')
      }
      catch (err) {
        notifier.error(err.message)
      }
      finally {
        this.loading = false
      }
    },

    async countPages(file: File): Promise<number> {
      try {
        if (!file || file.type !== 'application/pdf')
          throw new Error('Arquivo inválido ou não encontrado no FormData')

        const arrayBuffer = await file.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)

        const pdfDoc = await PDFDocument.load(uint8Array)

        return pdfDoc.getPageCount()
      }
      catch (error) {
        console.error('Erro ao contar páginas do PDF:', error)
        notifier.error('Error counting PDF pages')
      }
    },
  },
})
