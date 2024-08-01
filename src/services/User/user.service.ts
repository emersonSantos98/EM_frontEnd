import type { IUseUserStore } from '@/store/user'
import { useUserStore } from '@/store/user'
import Notifier from '@core/utils/Notifier'
import UserClient from '@/api/User/user.client'
import type { IUseAppLayoutStore } from '@/store/appLayout'
import { useAppLayoutStore } from '@/store/appLayout'
import type { IUserClient } from '@/api/User/models/types'
import type { IUser } from '@types/types'

export default class UserService {
  public readonly client: IUserClient
  public readonly notifier: Notifier
  public readonly store: IUseUserStore
  public readonly appLayout: IUseAppLayoutStore

  constructor() {
    this.client = new UserClient()
    this.notifier = new Notifier()
    this.store = useUserStore()
    this.appLayout = useAppLayoutStore()
  }

  async create(dataBody: IUser) {
    this.appLayout.setLoading(true)
    try {
      const user = await this.client.postUserCreate(dataBody)

      this.store.addUser(user)
      this.notifier.success('Usuário criado com sucesso')
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
    finally {
      this.appLayout.setLoading(false)
    }
  }

  async findAll(query: IQueryUserUser) {
    this.appLayout.setLoading(true)
    try {
      const { data, total } = await this.client.getUserFindAll(query)

      this.store.setUsers(data)
      this.store.totalUsers = total
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
    finally {
      this.appLayout.setLoading(false)
    }
  }

  async findOne(id: number) {
    this.appLayout.setLoading(true)
    try {
      const user = await this.client.getUserFindOneId(id)

      this.store.user = user
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
    finally {
      this.appLayout.setLoading(false)
    }
  }

  async update(id: number, dataBody: IUser) {
    this.appLayout.setLoading(true)
    try {
      const user = await this.client.putUserUpdateId(id, dataBody)

      this.notifier.success('Usuario actualizado com sucesso')
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
    finally {
      this.appLayout.setLoading(false)
    }
  }

  async delete(id: number) {
    this.appLayout.setLoading(true)
    try {
      await this.client.deleteUserDeleteId(id)
      this.notifier.success('Usuário deletado com sucesso')
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
    finally {
      this.appLayout.setLoading(false)
    }
  }

  async createOrUpdate(dataBody: IUser) {
    this.appLayout.setLoading(true)
    try {
      if (dataBody.id) {
        const { password, passwordConfirmation, ...data } = dataBody

        await this.update(dataBody.id, data)
        this.store.setIsUpdate(true)
        await this.findAll({ page: 1, limit: 10 })
      }
      else {
        await this.create(dataBody)
        this.store.setIsUpdate(false)
        await this.findAll({ page: 1, limit: 10 })
      }
    }
    catch (err: any) {
      throw this.notifier.error(err.message)
    }
    finally {
      this.appLayout.setLoading(false)
    }
  }
}
