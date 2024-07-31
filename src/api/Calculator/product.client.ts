import axios from '@axios'


import {Product} from "@/views/apps/calculator/types";

export async function create(data: Product) {
  try {
    return await axios.post('product/create', data)
  }
  catch (err) {
    throw new Error(err.message)
  }
}
export async function findAll() {
  try {
    return await axios.get('product/findAll')
  }
  catch (err) {
    throw new Error(err.message)
  }
}

export async function findOne() {
  try {
    return await axios.get('product/findOne')
  }
  catch (err) {
    throw new Error(err.message)
  }
}

export async function update(data: Product) {
  try {
    return await axios.put('product/update', data)
  }
  catch (err) {
    throw new Error(err.message)
  }
}

export async function remove(data: Product) {
  try {
    return await axios.delete('product/delete', { data })
  }
  catch (err) {
    throw new Error(err.message)
  }
}
