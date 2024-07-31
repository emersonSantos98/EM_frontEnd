import {IPostAuthRefresToeknResponse} from "@/client/auth/models/types";

export interface IPostAuthLoginBody {
  email: string
  password: string
}

export interface IUserData {
  uuid: string
  full_name: string
  email: string
  role: string
  status: string
  created_at: string
  updated_at: string
}

export interface IAbility {
  action: string
  subject: string
}

export interface IPostAuthLoginResponse {
  userAbilities: IAbility[]
  accessToken: string
  refreshToken: string
  userData: IUserData
}

export interface IPostAuthLoginBody {
  email: string
  password: string
}

export interface IRoleDTO {
  createdAt: string | null
  id: string | null
  label: string | null
  name: string | null
  updatedAt: string | null
}

export interface IUserDataDTO {
  createdAt: string | null
  email: string | null
  email_verified_at: string | null
  id: string | null
  name: string | null
  password: string | null
  remember_token: string | null
  role: IRoleDTO | null
  updatedAt: string | null
  user_group_id: string | null
  uuid: string | null
}

export interface IUserAbilitiesDTO {
  id: string
  subject: string
  action: string
}

export interface IPostAuthLoginResponse {
  accessToken: string
  refreshToken: string
  userData: IUserDataDTO
  userAbilities: IUserAbilitiesDTO[]
}

export interface IAuthClient {
  postAuthLogin: (postAuthLoginBody: IPostAuthLoginBody) => Promise<IPostAuthLoginResponse>
  getAuthVerifyToken: () => Promise<string>
  postAuthRefreshToken: () => Promise<IPostAuthRefresToeknResponse>
  getAuthGetAutorizationUrl: () => Promise<string>
}

