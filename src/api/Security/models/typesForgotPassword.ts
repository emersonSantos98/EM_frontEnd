import {IFormForgotPasswordDTO} from "@/store/SecurityStore";

export interface IPostSecurityForgotPasswordBody {
  email: string
}

export interface IPostSecurityForgotPasswordResponse {
  message : string
  email : string
  user_id :number
}
export interface IForgotPasswordClient {
  postSecurityForgotPassword: (postSecurityForgotPasswordBody: IFormForgotPasswordDTO) => Promise<IPostSecurityForgotPasswordResponse>
}
