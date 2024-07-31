import axios from '@axios'

import type { ProfileParams } from '@/views/apps/myProfile/types'

export async function findAll(params: ProfileParams) {
  try {
    const repos = await axios.get('/user/findAll', { params })

    return repos.data
  }
  catch (err) {
    throw new Error(err.message)
  }
}

export async function findOne() {
  try {
    return await axios.get('/user/findOne')
  }
  catch (err) {
    throw new Error(err.message)
  }
}

export async function update(data: ProfileParams) {
  try {
    return await axios.put('/customer/update', data)
  }
  catch (err) {
    throw new Error(err.message)
  }
}
