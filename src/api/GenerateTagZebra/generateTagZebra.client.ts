import type {AxiosInstance} from 'axios'
import api from '@axios'
import { GenerateTagZebraParams } from '@/views/apps/generateTagZebra/types'
import { GenerateTagSheinParams } from '@/views/apps/generateTagShein/types'
import { json } from 'stream/consumers'




export async function findAll(params: GenerateTagZebraParams) {
  try {
    const repos = await api.get('/generatetagzebra/findAll', { params })

    return repos.data
  }
  catch (err) {
    throw new Error(err.message)
  }
}

export async function findOne() {
  try {
    return await api.get('/generatetagzebra/findOne')
  }
  catch (err) {
    throw new Error(err.message)
  }
}


export async function update(data: GenerateTagZebraParams) {
  try {
    return await api.put('/generatetagzebra/update', data)
  }
  catch (err) {
    throw new Error(err.message)
  }
}

export async function generateTagZebra(data: GenerateTagZebraParams) {
  try { 
    return await api.post('/generatetagzebra/create', data)
  }
  catch (err) {
    throw new Error(err.message)
  }
}


export async function generateTagShein(data: FormData) {
  try { 
   

    const response = await api.post('/generatepdfs/create',  data, { headers:{
      'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001', 
 },  timeout: 600000,  responseType:"blob"} )

 console.log(response, 'responsesdf')
    return response
  }
  catch (err) {
    throw new Error(err.message)
  }
}
