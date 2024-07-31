import {IFormValidCodeDTO} from "@/store/SecurityStore";

export interface IPostSecurityValidCodeBody {
  user_id: string
  code: number
}

export interface IPostSecurityValidCodeResponse {
  message : string
  valid : boolean
  user_id :number
}
export interface IValidCodeClient {
  postSecurityValidCode: (postSecurityValidCodeBody: IFormValidCodeDTO) => Promise<IPostSecurityValidCodeResponse>
}
