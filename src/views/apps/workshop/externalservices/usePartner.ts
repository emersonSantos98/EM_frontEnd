import { defineStore } from 'pinia'
import type { IQueryPartner, PartnerType } from './types'
import WorkshopService from '@/services/workshop/workshop.service'

export const usePartnerStore = defineStore('partner', {
  state: () => ({
    partners: {
      count: 0,
      rows: [] as PartnerType[],
    }, // Dados dos parceiros retornados pela API
    loadingPartners: false,
    findOne: null as PartnerType | null, // Um parceiro individual
  }),
  actions: {
    // Adicionar um parceiro
    async addPartner(partner: PartnerType) {
      try {
        await new WorkshopService().addPartner(partner)
        this.partners.rows.push(partner) // Atualiza a lista localmente
      }
      catch (error) {
        console.error('Erro ao adicionar parceiro:', error)
      }
    },

    // Buscar todos os parceiros com filtros
    async fetchPartners(query: IQueryPartner) {
      this.loadingPartners = true
      try {
        await new WorkshopService().findAllPartner(query)
      }
      catch (error) {
        console.error('Erro ao buscar parceiros:', error)
        this.partners = { count: 0, rows: [] } // Reseta em caso de erro
      }
      finally {
        this.loadingPartners = false
      }
    },

    // Buscar um parceiro pelo ID
    async fetchOnePartner(id: string) {
      try {
        await new WorkshopService().findOnePartner(id)
      }
      catch (error) {
        console.error('Erro ao buscar parceiro:', error)
      }
    },

    // Atualizar dados de um parceiro
    async updatePartner(id: string, partner: PartnerType) {
      try {
        await new WorkshopService().updatePartner(id, partner)

        // Atualiza os dados localmente
        const index = this.partners.rows.findIndex(p => p.id === id)
        if (index !== -1)
          this.partners.rows[index] = { ...this.partners.rows[index], ...partner }
      }
      catch (error) {
        console.error('Erro ao atualizar parceiro:', error)
      }
    },

    // Deletar um parceiro pelo ID
    async deletePartner(id: string) {
      try {
        await new WorkshopService().deletePartner(id)
      }
      catch (error) {
        console.error('Erro ao deletar parceiro:', error)
      }
    },
  },
})

export interface IUsePartnerStore {
  partners: {
    count: number
    rows: PartnerType[]
  }
  loadingPartners: boolean
  findOne: PartnerType | null
  addPartner: (partner: PartnerType) => Promise<void>
  fetchPartners: (query: IQueryPartner) => Promise<void>
  fetchOnePartner: (id: string) => Promise<void>
  updatePartner: (id: string, partner: PartnerType) => Promise<void>
  deletePartner: (id: string) => Promise<void>
}
