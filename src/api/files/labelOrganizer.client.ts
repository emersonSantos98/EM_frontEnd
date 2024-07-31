import axios from '@axios'

export async function generateShippingLabels(params: FormData) {
  try {
    const response = await axios.post('generateShippingLabels/create', params, {
      headers: {
        'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
      },
      responseType: 'blob',
    })

    return response.data
  }
  catch (err) {
    throw new Error(err.message)
  }
}
