import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import type { IFormLoginDTO } from './models/types'

export const LoginStore = defineStore('LoginStore', () => {
  const formLogin = reactive<IFormLoginDTO>({
    email: '',
    password: '',
  })

  const loading = ref<boolean>(false)

  const setLoading = (value: boolean) => (loading.value = value)

  const rememberMyPassword = ref<boolean>(false)

  const showPassword = ref(false)

  const getTypedPassword = computed(() => (showPassword.value ? 'text' : 'password'))

  const togglePassword = () => (showPassword.value = !showPassword.value)

  const resetFormLogin = () => {
    formLogin.email = ''
    formLogin.password = ''
    loading.value = false
    showPassword.value = false
  }

  const saveRememberMyPassword = () => {
    localStorage.setItem('rememberMyPassword', JSON.stringify(rememberMyPassword.value))
    localStorage.setItem('email', JSON.stringify(formLogin.email))
    localStorage.setItem('password', JSON.stringify(formLogin.password))
  }

  const removeRememberMyPassword = () => {
    localStorage.removeItem('rememberMyPassword')
    localStorage.removeItem('email')
    localStorage.removeItem('password')
  }

  const getRememberMyPassword = () => {
    const remember = localStorage.getItem('rememberMyPassword')
    const email = localStorage.getItem('email')
    const password = localStorage.getItem('password')
    if (remember) {
      formLogin.email = email ? JSON.parse(email) : ''
      formLogin.password = password ? JSON.parse(password) : ''
    }
  }

  return {
    formLogin,
    rememberMyPassword,
    showPassword,
    getTypedPassword,
    togglePassword,
    loading,
    setLoading,
    resetFormLogin,
    saveRememberMyPassword,
    getRememberMyPassword,
    removeRememberMyPassword,
  }
})

export interface ILoginStore {
  formLogin: IFormLoginDTO
  rememberMyPassword: boolean
  showPassword: boolean
  getTypedPassword: string
  togglePassword: () => void
  loading: boolean
  setLoading: (value: boolean) => void
  resetFormLogin: () => void
  saveRememberMyPassword: () => void
  getRememberMyPassword: () => void
  removeRememberMyPassword: () => void
}
