import {IRoles} from "@/modules/AccessControl/list/Roles/models/types";

export interface ICustomer {
  id: number
  uuid: string
  user_id: number
  name: string
  typeDocument: string
  cellphone: string
  document: string
  status: number
  birth_date: string
  updatedAt: string
  createdAt: string
}



export interface IUser {
  id?: number
  avatar?: string
  uuid?: string
  first_name?: string
  last_name?: string
  email?: string
  password?: string
  passwordConfirmation?: string
  user_group_id?: number
  createdAt?: string
  updatedAt?: string
  role?: IRoles
  name?: string
  typeDocument?: string
  cellphone?: string
  document?: string
  status?: number
  popup_notification?: number
  birth_date?: string
}

export interface IOrganization {
  id: number
  user_id: number
  name: string
  countryCode: string
  document: string
  typeDocument: string
  updatedAt: string
  createdAt: string
}

export interface IRegisterResponse {
  customer: ICustomer
  user: IUser
  organization: IOrganization
}

export interface IPermissionGroup {
  id?: number
  id_usergroup?: number
  id_permission?: number
  creadtedAt?: string
  updatedAt?: string
  role: IRoles
  permission: IPermission
}

export interface IPermission {
  id?: number
  actions?: string
  subjects?: string
  createdAt?: string
  updatedAt?: string
}

export interface ICreatePermissionGroup {
  name: string
  subjects: string
}
