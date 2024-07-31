import axios from '@axios'

import type { Calculation } from '@/views/apps/calculator/types'

export async function create(data: Calculation) {
  try {
    return await axios.post('calculation/create', data)
  }
  catch (err) {
    throw new Error(err.message)
  }
}
export async function findAll() {
  try {
    return await axios.get('calculation/findAll')
  }
  catch (err) {
    throw new Error(err.message)
  }
}

export async function findOne() {
  try {
    return await axios.get('calculation/findOne')
  }
  catch (err) {
    throw new Error(err.message)
  }
}

export async function update(data: Calculation) {
  try {
    return await axios.put('calculation/update', data)
  }
  catch (err) {
    throw new Error(err.message)
  }
}

export async function remove(data: Calculation) {
  try {
    return await axios.delete('calculation/delete', { data })
  }
  catch (err) {
    throw new Error(err.message)
  }
}
