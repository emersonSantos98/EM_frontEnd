import type { IRegisterStore } from '@/views/register/register.store'
import { useRegisterStore } from '@/views/register/register.store'
import type { IFormRegisterDTO } from '@/views/register/models/types'
import Notifier from '@core/utils/Notifier'
import UserClient from "@/api/User/user.client";
import {IUserClient} from "@/api/User/models/types";

export default class RegisterService {
  public readonly store: IRegisterStore
  public readonly client: IUserClient
  private readonly notifier: Notifier

  constructor() {
    this.store = useRegisterStore()
    this.client = new UserClient()
    this.notifier = new Notifier()
  }

  async authRegister(formRegister: IFormRegisterDTO = this.store.getFormRegister)  {
    try {
      const {user, organization, customer} = await this.client.postUserCreate(formRegister)
      this.notifier.success('Conta criada com sucesso!')
      return {
        user,
        organization,
        customer
      }
    } catch (err: any) {
      console.log(err)
      throw this.notifier.error(err.message)
    }
  }
}
