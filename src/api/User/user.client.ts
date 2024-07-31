import type {AxiosInstance} from 'axios'
import api from '@axios'
import ErrorMessage from '@core/utils/Error'
import {IUser} from "@types/types";
import {IQueryUser} from "@/api/User/models/types";

export default class UserClient {
  private readonly api: AxiosInstance
  private readonly error: ErrorMessage

  constructor() {
    this.api = api
    this.error = new ErrorMessage()
  }

  async postUserCreate(dataBody: IUser) {
    try {
      const {data} = await this.api.post('/user/create', dataBody)

      return data
    } catch (err: any) {
      throw this.error.message(err, 'Não conseguimos criar o usuário.')
    }
  }

  async getUserFindAll(query: IQueryUser) {
    try {
      const { data} = await this.api.get('/user/findAll', {params: query})

      return data
    } catch (err: any) {
      throw this.error.message(err, 'Não conseguimos listar os usuário.')
    }
  }

  async getUserFindOneId(id: number) {
    try {
      const {data} = await this.api.get(`/user/findOne/${id}`)

      return data
    } catch (err: any) {
      throw this.error.message(err, 'Não conseguimos buscar o usuário.')
    }
  }

  async putUserUpdateId(id: number, dataBody: IUser) {
    try {
      const {data} = await this.api.put(`/user/update/${id}`, dataBody)

      return data
    } catch (err: any) {
      throw this.error.message(err, 'Não conseguimos atualizar o usuário.')
    }
  }

  async deleteUserDeleteId(id: number) {
    try {
      const {data} = await this.api.delete(`/user/delete/${id}`)

      return data
    } catch (err: any) {
      throw this.error.message(err, 'Não conseguimos deletar o usuário.')
    }
  }

}
