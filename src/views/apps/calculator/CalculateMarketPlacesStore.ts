import { defineStore } from 'pinia'
import Notifier from '@core/utils/Notifier'
import { create } from '@/api/Calculator/product.client'
import type { Calculation, Parameters, Product } from '@/views/apps/calculator/types'

const notifier = new Notifier()
export const useCalculateMarketPlacesStore = defineStore('CalculateMarketPlacesStore', {
  state: () => ({
    loading: false,
    product: {} as Product,
    calculateMarketPlace: {} as Calculation,
    parameters: {} as Parameters,
  }),

  actions: {
    async create() {
      try {
        this.loading = true

        const formData = new FormData()

        formData.append('name_product', this.product.name_product)
        formData.append('description', this.product.description)
        formData.append('total_cost', String(this.product.total_cost))
        formData.append('profit_margin', String(this.product.profit_margin))
        formData.append('price_sale', String(this.calculateMarketPlace.price_sale))
        formData.append('nominal_profit', String(this.calculateMarketPlace.nominal_profit))
        formData.append('working_capital', String(this.calculateMarketPlace.working_capital))

        const response = await create(formData)

        if (response.status === 201)
          notifier.success('Calculo exportado com sucesso')
        else
          notifier.error('Erro ao exportar calculo')
      }
      catch (err) {
        notifier.error(`Error creating product: ${err.message}`)
      }
      finally {
        this.loading = false
      }
    },

    setProduct(totalCost: number, profitMargin: number) {
      this.product.total_cost = totalCost
      this.product.profit_margin = profitMargin
    },
    setCalculateMarketPlace(priceSale: number, nominalProfit: number, workingCapital: number) {
      this.calculateMarketPlace.price_sale = priceSale
      this.calculateMarketPlace.nominal_profit = nominalProfit
      this.calculateMarketPlace.working_capital = workingCapital
    },
    setParameters(freeShippingProgram: string, marketplaceCommission: number, taxRate: number, otherFees: number) {
      this.parameters.free_shipping_program = String(freeShippingProgram)
      this.parameters.marketplace_commission = marketplaceCommission
      this.parameters.tax_rate = taxRate
      this.parameters.other_fees = otherFees
    },
    setProductDetails(nameProduct: string, description: string) {
      this.product.name_product = nameProduct
      this.product.description = description
    },

  },

})
