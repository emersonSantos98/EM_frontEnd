import {IFormResetPasswordDTO} from "@/store/SecurityStore";

export interface IPostSecurityResetPasswordBody {
  user_id : number
  newPassword: string
  newPasswordConfirmation :string
}
export interface IData {
  id : number
  uuid : string
  name : string
  email : string
  email_verified_at : string
  password:string
  remember_token:string
  user_group_id:string
  createdAt:string
  updatedAt:string
}
export interface IInsertPasswordOld {
  id :number
  password_old:string,
  user_id: number,
  createdAt:string
  updatedAt:string
}
export interface IPostSecurityResetPasswordResponse {
  message : string
  data : IData
  insertPasswordOld :IInsertPasswordOld
}
export interface IResetPasswordClient {
  postSecurityResetPassword: (postSecurityResetPasswordBody: IFormResetPasswordDTO) => Promise<IPostSecurityResetPasswordResponse>
}
