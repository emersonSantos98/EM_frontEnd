import axios from '@axios'

import type {OrganizationParams, AddressParams } from '@/views/apps/organization/types'


export async function findOne() {
  try {
    return await axios.get('organization/findOne')
  }
  catch (err) {
    throw new Error(err.message)
  }
}

export async function update(data: OrganizationParams) {
  try {
    return await axios.put('organization/update', data)
  }
  catch (err) {
    throw new Error(err.message)
  }
}

export async function createAdress(data: AddressParams) {
  try {
    return await axios.post('address/create', data)
  }
  catch (err) {
    throw new Error(err.message)
  }
}

export async function updateAdress(data: AddressParams) {
  try {
    return await axios.put('address/update', data)
  }
  catch (err) {
    throw new Error(err.message)
  }
}
