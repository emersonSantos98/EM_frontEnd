import { defineStore } from 'pinia'
import { generateShippingLabels } from '@/api/files/labelOrganizer.client'
import Notifier from '@core/utils/Notifier'

const notifier = new Notifier()

export const useLabelOrganizerStore = defineStore('LabelOrganizerStore', {
  state: () => ({
    loading: false,
    generatedLabelUrl: null as string | null,
  }),
  actions: {
    async generateShippingLabels(params: FormData) {
      this.loading = true
      try {
        const response = await generateShippingLabels(params)
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
  },
})
