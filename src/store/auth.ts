import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'
import type { IUserDataDTO } from '@/modules/account/client/login/models/types'

const baseURL = import.meta.env.VITE_API_URL as string
export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('accessToken'))
  const refreshToken = ref(localStorage.getItem('refreshToken'))
  const userData = ref(JSON.parse(localStorage.getItem('userData') || '{}'))
  const userAbilities = ref(JSON.parse(localStorage.getItem('userAbilities') || '{}'))
  const isAuth = ref(false)

  function setToken(tokenValue: string) {
    localStorage.setItem('accessToken', tokenValue)
    accessToken.value = tokenValue
  }

  function setRefreshToken(refreshTokenValue: string) {
    localStorage.setItem('refreshToken', refreshTokenValue)
    refreshToken.value = refreshTokenValue
  }
  function setDadosTemporario(accessTokenValue:string , refreshTokenValue: string ,userAbilitiesValue:string ) {
    localStorage.setItem('refreshTokenTemporario', accessTokenValue)
    localStorage.setItem('accessTokenTemporario', refreshTokenValue)
    localStorage.setItem('userAbilitiesTemporario', JSON.stringify(userAbilitiesValue))
  }
  function setUser(userValue: IUserDataDTO) {
    localStorage.setItem('userData', JSON.stringify(userValue))
    userData.value = userValue
  }

  function setIsAuth(isAuthValue: boolean) {
    isAuth.value = isAuthValue
  }
  async function checkToken() {
    // Verifique se o token de acesso ainda é válido
    try {
      const tokenAuth = `Bearer ${accessToken.value}`

      const { data } = await axios.get(`${baseURL}/auth/verifyToken`, {
        headers: { Authorization: tokenAuth },
      })

      return data
    }
    catch (error) {
      // Lidar com erros de atualização do token
      // @ts-expect-error
      console.log('error', error.response.data)
    }
  }

  async function Tokenrefresh() {
    try {
      const response = await axios.post(`${baseURL}/auth/refreshToken`, {
        refreshToken: refreshToken.value,
      })

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data

      setToken(newAccessToken)
      setRefreshToken(newRefreshToken)

      return true
    }
    catch (error) {
      clearLogout()
      await router.push({ name: 'login' })

      return false
    }
  }

  function setAbilities(AbilitiesValue: object) {
    localStorage.setItem('userAbilities', JSON.stringify(AbilitiesValue))
    userAbilities.value = AbilitiesValue
  }

  function clearLogout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userData')
    localStorage.removeItem('userAbilities')
    accessToken.value = null
    refreshToken.value = null
    userData.value = null
    userAbilities.value = null
    isAuth.value = false
  }

  return {
    accessToken,
    userData,
    setToken,
    setUser,
    setRefreshToken,
    setDadosTemporario,
    checkToken,
    setAbilities,
    userAbilities,
    clearLogout,
    isAuth,
    setIsAuth,
    Tokenrefresh,
  }
})
