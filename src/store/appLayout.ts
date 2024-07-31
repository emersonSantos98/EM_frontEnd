import {ref} from 'vue'
import {defineStore} from 'pinia'

export const useAppLayoutStore = defineStore('AppLayout', () => {
  const loading = ref<boolean>(false)

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const getLoading = computed(() => loading.value)

  return {
    loading,
    setLoading,
    getLoading
  }
})

export interface IUseAppLayoutStore {
  loading: boolean
  setLoading: (value: boolean) => void
  getLoading: ComputedRef<boolean>
}
