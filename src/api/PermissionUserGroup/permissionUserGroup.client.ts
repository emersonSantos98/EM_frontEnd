import type {AxiosInstance} from 'axios'
import api from '@axios'
import ErrorMessage from '@core/utils/Error'
import type {IAuthClient, IPostAuthLoginBody, IPostAuthLoginResponse} from '@/api/Auth/models/types'
import type {IPostAuthRefresToeknResponse} from '@/api/auth/models/types'
import {IPermissionUserGroupDTO, IQueryPermissionUserGroup} from "@/api/PermissionUserGroup/models/types";

export default class PermissionUserGroupClient {
  private readonly api: AxiosInstance
  private readonly error: ErrorMessage

  constructor() {
    this.api = api
    this.error = new ErrorMessage()
  }

  async postPermissionUserGroupCreate(dataBody: IPermissionUserGroupDTO) {
    try {
      const {data} = await this.api.post('/permissionusergroup/create', dataBody)

      return data
    } catch (err: any) {
      throw this.error.message(err, 'Não conseguimos fazer authenticar.')
    }
  }

  async getPermissionUserGroupFindAll(query: IQueryPermissionUserGroup) {
    try {
      const { data: { data }} = await this.api.get('/permissionusergroup/findAll', {params: query})

      return data
    } catch (err: any) {
      throw this.error.message(err, 'Não conseguimos fazer authenticar.')
    }
  }

  async getPermissionUserGroupFindOneId(id: number) {
    try {
      const {data} = await this.api.get(`/permissionusergroup/findOne/${id}`)

      return data
    } catch (err: any) {
      throw this.error.message(err, 'Não conseguimos fazer authenticar.')
    }
  }

  async putPermissionUserGroupUpdateId(id: number, dataBody: IPermissionUserGroupDTO) {
    try {
      const {data} = await this.api.put(`/permissionusergroup/update/${id}`, dataBody)

      return data
    } catch (err: any) {
      throw this.error.message(err, 'Não conseguimos fazer authenticar.')
    }
  }

  async deletePermissionUserGroupDeleteId(id: number) {
    try {
      const {data} = await this.api.delete(`/permissionusergroup/delete/${id}`)

      return data
    } catch (err: any) {
      throw this.error.message(err, 'Não conseguimos fazer authenticar.')
    }
  }

}
