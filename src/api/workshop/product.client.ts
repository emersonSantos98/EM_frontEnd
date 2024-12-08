import axios from '@axios'
import type { IQueryVariation, ProductType, IQueryProduct } from '@/views/apps/workshop/product/types'
import ErrorMessage from '@/@core/utils/Error'

export default class ProductClient {
  private readonly error: ErrorMessage

  constructor() {
    this.error = new ErrorMessage()
  }

  async findAll(query: IQueryProduct) {
    try {
      return await axios.get('produtos', { params: query })
    }
    catch (err: any) {
      throw this.error.message(err, 'Não conseguimos listar os produtos.')
    }
  }

  async findOne(id: string) {
    try {
      return await axios.get(`produtos/${id}`)
    }
    catch (err: any) {
      throw this.error.message(err, 'Não conseguimos buscar o produto.')
    }
  }

  async update(id: string, data: ProductType) {
    try {
      return await axios.put(`produtos/update/${id}`, data)
    }
    catch (err: any) {
      throw this.error.message(err, 'Não conseguimos atualizar o produto.')
    }
  }

  async create(productData: { produto: ProductType; variacoes: IQueryVariation[] }) {
    try {
      return await axios.post('produtos/create', productData)
    }
    catch (err: any) {
      throw this.error.message(err, 'Não conseguimos criar o produto.')
    }
  }

  async delete(id: string) {
    try {
      return await axios.delete(`produtos/${id}`)
    }
    catch (err: any) {
      throw this.error.message(err, 'Não conseguimos deletar o produto.')
    }
  }
}
