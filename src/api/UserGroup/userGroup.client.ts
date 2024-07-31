import type {AxiosInstance} from 'axios'
import api from '@axios'
import ErrorMessage from '@core/utils/Error'
import {IUserGroupDTO, IQueryUserGroup} from "@/api/UserGroup/models/types";

export default class UserGroupClient {
  private readonly api: AxiosInstance
  private readonly error: ErrorMessage

  constructor() {
    this.api = api
    this.error = new ErrorMessage()
  }

  async postUserGroupCreate(dataBody: IUserGroupDTO) {
    try {
      const {data} = await this.api.post('/usergroup/create', dataBody)

      return data
    } catch (err: any) {
      throw this.error.message(err, 'Não conseguimos criar o grupo de usuário.')
    }
  }

  async getUserGroupFindAll(query: IQueryUserGroup) {
    try {
      const { data: { data }} = await this.api.get('/usergroup/findAll', {params: query})

      return data
    } catch (err: any) {
      throw this.error.message(err, 'Não conseguimos listar os grupos de usuário.')
    }
  }

  async getUserGroupFindOneId(id: number) {
    try {
      const {data} = await this.api.get(`/usergroup/findOne/${id}`)

      return data
    } catch (err: any) {
      throw this.error.message(err, 'Não conseguimos buscar o grupo de usuário.')
    }
  }

  async putUserGroupUpdateId(id: number, dataBody: IUserGroupDTO) {
    try {
      const {data} = await this.api.put(`/usergroup/update/${id}`, dataBody)

      return data
    } catch (err: any) {
      throw this.error.message(err, 'Não conseguimos atualizar o grupo de usuário.')
    }
  }

  async deleteUserGroupDeleteId(id: number) {
    try {
      const {data} = await this.api.delete(`/usergroup/delete/${id}`)

      return data
    } catch (err: any) {
      throw this.error.message(err, 'Não conseguimos deletar o grupo de usuário.')
    }
  }

}
