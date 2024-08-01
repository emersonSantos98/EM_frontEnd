import { defineStore } from 'pinia'
import type { AddressParams, OrganizationParams } from '@/views/apps/organization/types'
import { createAdress, findOne, update, updateAdress } from '@/api/Organization/organization.client'
import { findCep } from '@/api/ViaCep/viaCep.client'
import { clearCaracters } from '@/@core/utils/helpers'
import Notifier from '@core/utils/Notifier'

const notifier = new Notifier()

export const useOrganizationStore = defineStore('OrganizationStore', {

  state: () => ({
    loading: false,
  }),

  // getters: {
  //   loading: (state) => state.loading,
  // },

  actions: {
    // 👉 Fetch users data

    async update(data: OrganizationParams) {
      try {
        this.loading = true

        const response = await update(data)

        if (response.status === 200) {
          notifier.success('Organization updated successfully')
          this.loading = false
        }

        else { notifier.error('Something went wrong') }
      }
      catch (err) {
        throw new Error(err.message)
      }
    },

    async findOne() {
      try {
        this.loading = true

        const response = await findOne()

        this.loading = false

        return response.data
      }
      catch (err) {
        throw new Error(err.message)
      }
    },

    async findCep(cep: string) {
      cep = clearCaracters(cep)
      try {
        this.loading = true

        const response = await findCep(cep)

        this.loading = false

        return response.data
      }
      catch (err) {
        throw new Error(err.message)
      }
    },

  },
})

export const useAdressStore = defineStore('AdressStore', {

  state: () => ({
    loading: false,
  }),

  actions: {

    async create(data: AddressParams) {
      try {
        this.loading = true

        const response = await createAdress(data)

        if (response.status === 201) {
          notifier.success('Adress created successfully')
          this.loading = false
        }

        else { notifier.error('Something went wrong') }
      }
      catch (err) {
        throw new Error(err.message)
      }
    },

    async update(data: AddressParams) {
      try {
        this.loading = true

        const response = await updateAdress(data)
        if (response.status === 200) {
          notifier.success('Adress updated successfully')
          this.loading = false
        }

        else { notifier.error('Something went wrong') }
      }
      catch (err) {
        throw new Error(err.message)
      }
    },

  },
})
