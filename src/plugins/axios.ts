// eslint-disable-next-line valid-appcardcode-demo-sfc
import type { AxiosError, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import authService from '@/services/auth/auth.service'

const baseURL = import.meta.env.VITE_API_URL as string

const axiosIns = axios.create({
  baseURL,
})

axiosIns.interceptors.request.use((config: AxiosRequestConfig) => {
  const accessToken = localStorage.getItem('accessToken')

  // @ts-expect-error
  if (accessToken && config.authRequired !== false) {
    // @ts-expect-error
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

axiosIns.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config
    const refreshToken = localStorage.getItem('refreshToken')

    if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
      originalRequest._retry = true

      const accessToken = await authService.AuthRefreshToken()

      axiosIns.defaults.headers.common.Authorization = accessToken

      return axiosIns(originalRequest)
    }

    return Promise.reject(error)
  },
)

export default axiosIns
