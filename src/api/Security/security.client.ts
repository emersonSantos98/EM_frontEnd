import type { AxiosInstance } from 'axios'
import api from '@axios'
import ErrorMessage from '@core/utils/Error'
import type { ISecurityClient , IPostSecurityChangePasswordResponse } from '@/api/Security/models/types'
import type { IForgotPasswordClient ,IPostSecurityForgotPasswordResponse } from '@/api/Security/models/typesForgotPassword'
import type { IValidCodeClient,IPostSecurityValidCodeResponse } from '@/api/Security/models/typesValidCode'
import type { IPostSecurityResetPasswordResponse,IResetPasswordClient } from '@/api/Security/models/typesResetPassword'
import type { IPutSecurityTwoFactorResponse,ITwoFactorClient } from '@/api/Security/models/typesTwoFactor'
import {IFormChangePasswordDTO, IFormForgotPasswordDTO, IFormValidCodeDTO, IFormResetPasswordDTO, IFormTwoFactorDTO} from "@/store/SecurityStore";


export default class SecurityClient implements ISecurityClient,IForgotPasswordClient,IValidCodeClient , IResetPasswordClient,ITwoFactorClient {
  private readonly api: AxiosInstance
  private readonly error: ErrorMessage
  constructor() {
    this.api = api
    this.error = new ErrorMessage()
  }
  async postSecurityChangePassword(postSecurityChangePasswordBody: IFormChangePasswordDTO): Promise<IPostSecurityChangePasswordResponse> {
    try {
      const { data } = await this.api.post('/security/changePassword', postSecurityChangePasswordBody)

      return data
    }
    catch (err: any) {
      throw this.error.message(err, 'Não foi possivel alterar senha.')
    }
  }
  async postSecurityForgotPassword(postSecurityForgotPasswordBody: IFormForgotPasswordDTO): Promise<IPostSecurityForgotPasswordResponse> {
    try {
      const { data } = await this.api.post('/security/forgotPassword', postSecurityForgotPasswordBody)
      return data
    }
    catch (err: any) {
      throw this.error.message(err, 'Email nao encontrado.')
    }
  }
  async postSecurityValidCode(postSecurityValidCodeBody: IFormValidCodeDTO): Promise<IPostSecurityValidCodeResponse> {
  try {
    const { data } = await this.api.post('/code/validCode', postSecurityValidCodeBody)
    return data
  }
  catch (err: any) {
    throw this.error.message(err, 'Codigo invalido.')
  }
}
  async postSecurityResetPassword(postSecurityResetPasswordBody: IFormResetPasswordDTO): Promise<IPostSecurityResetPasswordResponse> {
    try {
      const { data } = await this.api.post('/security/resetPassword', postSecurityResetPasswordBody)

      return data
    }
    catch (err: any) {
      throw this.error.message(err, 'Não foi possivel alterar senha.')
    }
  }
  async putSecurityTwoFactor(putSecurityTwoFactorBody: IFormTwoFactorDTO): Promise<IPutSecurityTwoFactorResponse> {
    try {
      const { data } = await this.api.put('/security/twoFactorStatus', putSecurityTwoFactorBody)
      return data
    }
    catch (err: any) {
      throw this.error.message(err, 'Two Factor updated.')
    }
  }
  }
