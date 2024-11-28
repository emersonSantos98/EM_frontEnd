import Notifier from '@core/utils/Notifier'

import WorkshopClient from '@/api/workshop/workshop.client'
import type { IUsePartnerStore } from '@/views/apps/workshop/externalservices/usePartner'
import { usePartnerStore } from '@/views/apps/workshop/externalservices/usePartner'
import type { IQueryPartner, PartnerType } from '@/views/apps/workshop/externalservices/types'

export default class WorkshopService {
  public readonly client: WorkshopClient
  public readonly notifier: Notifier
  public readonly store: IUsePartnerStore

  constructor() {
    this.client = new WorkshopClient()
    this.notifier = new Notifier()
    this.store = usePartnerStore()
  }

  async findAllPartner(query: IQueryPartner) {
    this.store.loadingPartners = true
    try {
      const res = await this.client.findAll(query)

      this.store.partners = res.data.data

      this.notifier.success('Parceiros carregados com sucesso!')
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
    finally {
      this.store.loadingPartners = false
    }
  }

  async findOnePartner(id: string) {
    this.store.loadingPartners = true
    try {
      const res = await this.client.findOne(id)

      this.store.findOne = res.data.data
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
    finally {
      this.store.loadingPartners = false
    }
  }

  async addPartner(partner: PartnerType) {
    this.store.loadingPartners = true
    try {
      await this.client.create(partner)
      this.store.partners.rows.push(partner)

      this.notifier.success('Parceiro adicionado com sucesso!')
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
    finally {
      this.store.loadingPartners = false
    }
  }

  async updatePartner(id: string, partner: PartnerType) {
    this.store.loadingPartners = true
    try {
      await this.client.update(id, partner)

      const index = this.store.partners.rows.findIndex(p => p.id === partner)
      if (index !== -1)
        this.store.partners.rows[index] = { ...this.store.partners.rows[index], ...partner }

      this.notifier.success('Parceiro atualizado com sucesso!')
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
    finally {
      this.store.loadingPartners = false
    }
  }

  async deletePartner(id: string) {
    this.store.loadingPartners = true
    try {
      await this.client.delete(id)
      this.store.partners = this.store.partners.rows.filter(p => p.id !== id)

      this.notifier.success('Parceiro deletado com sucesso!')
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
    finally {
      this.store.loadingPartners = false
    }
  }
}
