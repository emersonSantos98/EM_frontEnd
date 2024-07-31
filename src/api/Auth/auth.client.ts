import type { AxiosInstance } from 'axios'
import api from '@axios'
import ErrorMessage from '@core/utils/Error'
import type { IAuthClient, IPostAuthLoginBody, IPostAuthLoginResponse } from '@/api/Auth/models/types'
import type { IPostAuthRefresToeknResponse } from '@/api/auth/models/types'

export default class AuthClient implements IAuthClient {
  private readonly api: AxiosInstance
  private readonly error: ErrorMessage
  constructor() {
    this.api = api
    this.error = new ErrorMessage()
  }

  async postAuthLogin(postAuthLoginBody: IPostAuthLoginBody): Promise<IPostAuthLoginResponse> {
    try {
      const { data } = await this.api.post('/auth/login', postAuthLoginBody)

      return data
    }
    catch (err: any) {
      throw this.error.message(err, 'Não conseguimos fazer authenticar.')
    }
  }

  async getAuthVerifyToken(): Promise<string> {
    try {
      const { data } = await this.api.get('/auth/verifyToken', {
        data: {
          authRequired: true,
        },
      })

      return data
    }
    catch (err: any) {
      throw this.error.message(err, 'Não conseguimos fazer authenticar.')
    }
  }

  async postAuthRefreshToken(): Promise<IPostAuthRefresToeknResponse> {
    try {
      const { data } = await this.api.post('/auth/refreshToken', { refreshToken: localStorage.getItem('refreshToken') })

      return data
    }
    catch (err: any) {
      throw this.error.message(err, 'Não conseguimos fazer authenticar.')
    }
  }

  async getAuthGetAutorizationUrl(): Promise<string> {
    try {
      const { data } = await this.api.get('/Auth/GetAuthorizationUrl')

      return data
    }
    catch (err: any) {
      throw this.error.message(err, 'Não conseguimos fazer authenticar.')
    }
  }
}
