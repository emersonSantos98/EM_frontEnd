import type {AxiosInstance} from 'axios'
import api from '@axios'
import ErrorMessage from '@core/utils/Error'
import {IPermissionDTO, IQueryPermission} from "@/api/Permission/models/types";
import {ICreatePermissionGroup} from "@types/types";

export default class PermissionClient {
  private readonly api: AxiosInstance
  private readonly error: ErrorMessage

  constructor() {
    this.api = api
    this.error = new ErrorMessage()
  }

  async postPermissionCreate(dataBody: IPermissionDTO) {
    try {
      const {data} = await this.api.post('/permission/create', dataBody)

      return data
    } catch (err: any) {
      throw this.error.message(err, 'Não conseguimos criar o grupo de usuário.')
    }
  }

  async getPermissionFindAll(query: IQueryPermission) {
    try {
      const { data } = await this.api.get('/permission/findAll', {params: query})

      return data
    } catch (err: any) {
      throw this.error.message(err, 'Não conseguimos listar os grupos de usuário.')
    }
  }

  async getPermissionFindOneId(id: number) {
    try {
      const {data} = await this.api.get(`/permission/findOne/${id}`)

      return data
    } catch (err: any) {
      throw this.error.message(err, 'Não conseguimos buscar o grupo de usuário.')
    }
  }

  async putPermissionUpdateId(id: number, dataBody: IPermissionDTO) {
    try {
      const {data} = await this.api.put(`/permission/update/${id}`, dataBody)

      return data
    } catch (err: any) {
      throw this.error.message(err, 'Não conseguimos atualizar o grupo de usuário.')
    }
  }

  async deletePermissionDeleteId(id: number) {
    try {
      const {data} = await this.api.delete(`/permission/delete/${id}`)

      return data
    } catch (err: any) {
      throw this.error.message(err, 'Não conseguimos deletar o grupo de usuário.')
    }
  }

  async postPermissionCreatePermissionRole(permission: string) {
    try {
      const { data} = await this.api.post('/permission/createPermissionRole', {
        subjects: permission
      })

      return data
    } catch (err: any) {
      throw this.error.message(err, 'Não conseguimos criar o grupo de usuário.')
    }
  }

}
