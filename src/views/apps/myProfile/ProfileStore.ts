import { defineStore } from 'pinia'
import type { ProfileParams } from '@/views/apps/myProfile/types'
import { findAll, findOne, update } from '@/api/MyProfile/profile.client'
import Notifier from '@core/utils/Notifier'
import { useAppLayoutStore } from '@/store/appLayout'

const notifier = new Notifier()
const appLayout = useAppLayoutStore()

export const useProfileStore = defineStore('ProfileStore', {

  state: () => ({
    loading: false,
  }),

  actions: {
    // 👉 Fetch users data
    async findAll(params: ProfileParams) {
      try {
        this.loading = true
        appLayout.setLoading(true)

        const response = await findAll(params)

        this.loading = false

        appLayout.setLoading(false)

        return response
      }
      catch (err) {
        throw new Error(err.message)
      }
    },

    async update(data: ProfileParams) {
      try {
        this.loading = true

        const response = await update(data)

        if (response.status === 200) {
          notifier.success('Profile updated successfully')
          this.loading = false
        }

        else { notifier.error('Something went wrong') }
      }
      catch (err) {
        // Notifier.error(`Erro ao atualizar o perfil ${err.message}`)
      }
    },

    async findOne() {
      try {
        this.loading = true
        appLayout.setLoading(true)

        const response = await findOne()

        this.loading = false
        appLayout.setLoading(false)

        return response.data
      }
      catch (err) {
        throw new Error(err.message)
      }
    },

  },
})
