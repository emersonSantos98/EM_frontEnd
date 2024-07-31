import type { AxiosError, AxiosResponse } from 'axios'
import axios from 'axios'

export class Api extends Error {
  constructor(public message: string) {
    super(`ApiError: ${message}`)
  }
}

export class Domain extends Error {
  constructor(public message: string) {
    super(message)
  }
}

export default class ErrorMessage {
  public message(error: AxiosError, msg: string) {
    if (axios.isAxiosError(error)) {
      const { status } = error.response as AxiosResponse<any>
      const messageResponse = error.response?.data.message
      if (status >= 400 && status < 500)
        return new Domain(messageResponse)

      if (status >= 500)
        return new Api(messageResponse)
    }

    return new Error(msg)
  }
}
