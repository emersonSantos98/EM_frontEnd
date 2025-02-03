import axios from '@axios'
import ErrorMessage from '@/@core/utils/Error'

export default class VariationClient {
  private readonly error: ErrorMessage

  constructor() {
    this.error = new ErrorMessage()
  }

  async delete(id: string) {
    try {
      return await axios.delete(`variation/${id}`)
    }
    catch (err: any) {
      throw this.error.message(err, 'Não conseguimos deletar a variação')
    }
  }
}
