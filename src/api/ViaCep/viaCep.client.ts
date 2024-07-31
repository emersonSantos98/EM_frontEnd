import axios from 'axios'

export async function findCep(cep: string) {
  try {
    return await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
  }
  catch (err) {
    throw new Error(err.message)
  }
}
