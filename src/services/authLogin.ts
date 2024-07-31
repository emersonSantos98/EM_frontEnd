import axios from '@axios'

export async function authLogin(email: string, password: string) {
  try {
    const response = await axios.post('/login', { email, password })

    return response.data
  }
  catch (error) {
    throw new Error(error.response.data.error)
  }
}

export async function refresh() {
  try {
    const response = await axios.post('/refreshToken', { refreshToken: localStorage.getItem('refreshToken') })

    return response.data
  }
  catch (error) {
    throw new Error(error.response.data.error)
  }
}

export async function authToken() {
  try {
    // @ts-ignore
    const response = await axios.get('/auth/verifyToken',{ 'authRequired': true })

    return response.data
  }
  catch (error) {
    throw new Error(error.response.data.error)
  }
}



