import {IPermissionUserGroupDTO} from "@/api/PermissionUserGroup/models/types";

export interface IUserGroupDTO {
  id?: number
  name: string
  label: string
  createdAd?: string
  updatedAd?: string
  permissionusergroup?: IPermissionUserGroupDTO[]
  total?: number
}

export interface IOptionsPagination {
  page: number,
  itemsPerPage: number,
  sortBy: string[],
  groupBy: string[],
  search: string,
}
export interface IQueryUserGroup {
  q?: string
  options?: IOptionsPagination
}
export interface IUserGroupClient {
  postUserGroupCreate(dataBody: IUserGroupDTO): Promise<any>
  getUserGroupFindAll(query: IQueryUserGroup): Promise<any>
  getUserGroupFindOneId(id: number): Promise<any>
  putUserGroupUpdateId(id: number, dataBody: IUserGroupDTO): Promise<any>
  deleteUserGroupDeleteId(id: number): Promise<any>
}
