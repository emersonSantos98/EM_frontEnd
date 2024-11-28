import axios from '@axios'
import type { PartnerType, IQueryPartner } from '@/views/apps/workshop/externalservices/types'
import ErrorMessage from '@/@core/utils/Error'

export default class WorkshopClient {
  private readonly error: ErrorMessage

  constructor() {
    this.error = new ErrorMessage()
  }

  async findAll(query: IQueryPartner) {
    try {
      return await axios.get('colaboradores', { params: query })
    }
    catch (err: any) {
      throw this.error.message(err, 'Não conseguimos listar os colaboradores.')
    }
  }

  async findOne(id: string) {
    try {
      return await axios.get(`colaboradores/${id}`)
    }
    catch (err: any) {
      throw this.error.message(err, 'Não conseguimos buscar o colaborador.')
    }
  }

  async update(id: string, data: PartnerType) {
    try {
      return await axios.put(`colaboradores/${id}`, data)
    }
    catch (err: any) {
      throw this.error.message(err, 'Não conseguimos atualizar o colaborador.')
    }
  }

  async create(data: PartnerType) {
    try {
      return await axios.post('colaboradores/create', data)
    }
    catch (err: any) {
      throw this.error.message(err, 'Não conseguimos criar o colaborador.')
    }
  }

  async delete(id: string) {
    try {
      return await axios.delete(`colaboradores/${id}`)
    }
    catch (err: any) {
      throw this.error.message(err, 'Não conseguimos deletar o colaborador.')
    }
  }
}
