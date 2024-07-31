import type { IFormChangePasswordDTO, IFormForgotPasswordDTO, IFormResetPasswordDTO, IFormTwoFactorDTO, IFormValidCodeDTO, IUserSecurityStore } from '@/store/SecurityStore'
import { useSecurityStore } from '@/store/SecurityStore'
import type { ISecurityClient } from '@/api/Security/models/types'
import type { IForgotPasswordClient } from '@/api/Security/models/typesForgotPassword'
import type { IValidCodeClient } from '@/api/Security/models/typesValidCode'
import type { IResetPasswordClient } from '@/api/Security/models/typesResetPassword'
import type { ITwoFactorClient } from '@/api/Security/models/typesTwoFactor'
import SecurityClient from '@/api/Security/security.client'
import Notifier from '@core/utils/Notifier'

export default class SecurityService {
  public readonly client: ISecurityClient
  public readonly iForgotPasswordClient: IForgotPasswordClient
  public readonly iValidCodeClient: IValidCodeClient
  public readonly iResetPasswordClient: IResetPasswordClient
  public readonly iTwoFactorClient: ITwoFactorClient
  public readonly notifier: Notifier
  public readonly securityStore: IUserSecurityStore
  private readonly securityClient: SecurityClient // Crie uma única instância aqui

  constructor() {
    this.securityClient = new SecurityClient() // Inicialize a instância única
    this.client = this.securityClient // Use a mesma instância para this.client
    this.iForgotPasswordClient = this.securityClient
    this.iValidCodeClient = this.securityClient
    this.iResetPasswordClient = this.securityClient
    this.iTwoFactorClient = this.securityClient

    this.notifier = new Notifier()
    this.securityStore = useSecurityStore()
  }

  async postSecurityChangePassword(formChangePassword: IFormChangePasswordDTO = this.securityStore.formSecurityChangePassword): Promise<void> {
    try {
      await this.client.postSecurityChangePassword(formChangePassword)
      this.notifier.success('Senha alterada com sucesso!')
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
  }

  async postSecurityResetPassword(formResetPassword: IFormResetPasswordDTO = this.securityStore.formSecurityResetPassword): Promise<void> {
    this.securityStore.setLoading(true)
    try {
      await this.iResetPasswordClient.postSecurityResetPassword(formResetPassword)
      this.notifier.success('Senha alterada com sucesso!')
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
    finally {
      this.securityStore.setLoading(false)
    }
  }

  async postSecurityForgotPassword(formForgotPassword: IFormForgotPasswordDTO = this.securityStore.formSecurityForgotPassword): Promise<void> {
    this.securityStore.setLoading(true)
    try {
      const { user_id, email } = await this.iForgotPasswordClient.postSecurityForgotPassword(formForgotPassword)

      localStorage.setItem('user_id', String(user_id))
      localStorage.setItem('email_to', email)
      this.notifier.success('Codigo enviado com sucesso!')
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
    finally {
      this.securityStore.setLoading(false)
    }
  }

  async postSecurityValidCode(formValidCode: IFormValidCodeDTO = this.securityStore.formSecurityValidCode): Promise<void> {
    try {
      await this.iValidCodeClient.postSecurityValidCode(formValidCode)
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
  }

  async putSecuritTwoFactor(formTwoFactor: IFormTwoFactorDTO = this.securityStore.formSecurityTwoFactor): Promise<void> {
    this.securityStore.setLoading(true)
    try {
      await this.iTwoFactorClient.putSecurityTwoFactor(formTwoFactor)
      this.notifier.success('Two Factor updated')
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
    finally {
      this.securityStore.setLoading(false)
    }
  }
}
