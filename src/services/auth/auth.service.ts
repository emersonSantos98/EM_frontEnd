import type { IAuthClient } from '@/api/Auth/models/types'
import AuthClient from '@/api/Auth/auth.client'
import Notifier from '@core/utils/Notifier'
import { useAppAbility } from '@/plugins/casl/useAppAbility'
import { useAuthStore } from '@/store/auth'
import type { ILoginStore } from '@/views/login/login.store'
import { LoginStore } from '@/views/login/login.store'
import type { AppAbility } from '@/plugins/casl/AppAbility'
import type { IFormLoginDTO } from '@/views/login/models/types'

export default class AuthService {
  public readonly client: IAuthClient
  public readonly notifier: Notifier
  private readonly ability: AppAbility
  private readonly authUser: any
  public readonly loginStore: ILoginStore

  constructor() {
    this.client = new AuthClient()
    this.notifier = new Notifier()
    this.ability = useAppAbility()
    this.authUser = useAuthStore()
    this.loginStore = LoginStore()
  }

  async authLogin(formLogin: IFormLoginDTO = this.loginStore.formLogin): Promise<void> {
    this.loginStore.setLoading(true)
    try {
      if (this.loginStore.rememberMyPassword) {
        this.loginStore.saveRememberMyPassword()
      } else {
        this.loginStore.removeRememberMyPassword()
      }
      const { refreshToken, accessToken, userData, userAbilities } = await this.client.postAuthLogin(formLogin)
      if(userData.two_factor === 1){
        this.ability.update(userAbilities as any)
        this.authUser.setUser(userData)
        this.authUser.setDadosTemporario(refreshToken,accessToken,userAbilities)
      }
      else{
        this.ability.update(userAbilities as any)
        this.authUser.setUser(userData)
        this.authUser.setDadosTemporario(refreshToken,accessToken,userAbilities)
        this.authUser.setToken(accessToken)
        this.authUser.setRefreshToken(refreshToken)
        this.authUser.setAbilities(userAbilities)
        this.authUser.setIsAuth(true)
        this.loginStore.resetFormLogin()
        this.notifier.success('Login realizado com sucesso!')
      }

    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
    finally {
      this.loginStore.setLoading(false)
    }
  }
  async codeValid(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshTokenTemporario')
      const accessToken =localStorage.getItem('accessTokenTemporario')
      const userAbilities =  localStorage.getItem('userAbilitiesTemporario')
      this.authUser.setToken(accessToken)
      this.authUser.setRefreshToken(refreshToken)
      this.authUser.setAbilities(userAbilities)
      this.authUser.setIsAuth(true)
      this.loginStore.resetFormLogin()
      localStorage.removeItem('refreshTokenTemporario')
      localStorage.removeItem('accessTokenTemporario')
      localStorage.removeItem('userAbilitiesTemporario')
      this.notifier.success('Login realizado com sucesso!')

    } catch (err: any) {
      throw this.notifier.error(err.message);
    }
  }
  async authVerifyToken(): Promise<void> {
    try {
      await this.client.getAuthVerifyToken()
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
  }

  async AuthRefreshToken() {
    try {
      const { refresh_token, access_token } = await this.client.postAuthRefreshToken()

      localStorage.setItem('refreshToken', refresh_token)
      localStorage.setItem('accessToken', access_token)

      return access_token
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
  }

  async authGoogle(): Promise<void> {
    try {
      await this.client.getAuthGetAutorizationUrl()
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
  }
}
