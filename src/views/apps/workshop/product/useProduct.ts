import { defineStore } from 'pinia'
import type { IQueryProduct, ProductType, VariationType } from './types'
import ProductService from '@/services/workshop/product.service'
import VariationClient from '@/services/workshop/variation.service'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: {
      count: 0,
      produtos: [] as (ProductType & { variacoes: VariationType[] })[],
    },
    loadingProducts: false,
    findOne: null as ProductType | null,
  }),
  actions: {
    async addProduct(formData: FormData) {
      try {
        // Envia os dados para o backend
        await new ProductService().addProduct(formData)
        console.log('Produto salvo com sucesso!')
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
    async findOneProduct(id: number) {
      try {
        await new ProductService().findOneProduct(id)
        console.log('Produto encontrado com sucesso!')
      }
      catch (error) {
        console.error('Erro ao buscar produto:', error)
      }
    },
    async deleteProduct(id: number) {
      try {
        await new ProductService().deleteProduct(id)
      }
      catch (error) {
        console.error('Erro ao deletar produto:', error)
      }
    },
    async updateProduct(id: number, formData: FormData) {
      try {
        await new ProductService().updateProduct(id, formData)
      }
      catch (error) {
        console.error('Erro ao atualizar produto:', error)
      }
    },

    // variações

    async deleteVariation(id: string) {
      this.loadingProducts = true
      try {
        await new VariationClient().deleteVariation(id)

        this.$patch(state => {
          state.products.produtos.forEach(produto => {
            produto.variacoes = produto.variacoes.filter(
              variacao => variacao.variacaoId !== id,
            )
          })
        })
      }
      catch (error) {
        console.error('Erro ao deletar variação:', error)
      }
      this.loadingProducts = false
    },

  },
})

export interface IUseProductStore {
  products: {
    count: number
    produtos: ProductType[]
  }
  findOne: ProductType | null
  loadingProducts: boolean
  addProduct: (partner: ProductType) => Promise<void>
  findAllProduct: (query: IQueryProduct) => Promise<void>
  findOneProduct: (id: number) => Promise<void>
}
