import {IPermissionDTO} from "@/api/Permission/models/types";

export interface IPermissionUserGroupDTO {
  id?: number
  is_usergroup?: number
  id_permission?: number
  createdAt?: string
  updatedAt?: string
  permission?: IPermissionDTO
}

export interface IOptionsPagination {
  page: number,
  itemsPerPage: number,
  sortBy: string[],
  groupBy: string[],
  search: string,
}
export interface IQueryPermissionUserGroup {
  q?: string
  options?: IOptionsPagination
}
export interface IPermissionUserGroupClient {
  postPermissionUserGroupCreate(dataBody: IPermissionUserGroupDTO): Promise<any>
  getPermissionUserGroupFindAll(query: IQueryPermissionUserGroup): Promise<any>
  getPermissionUserGroupFindOneId(id: number): Promise<any>
  putPermissionUserGroupUpdateId(id: number, dataBody: IPermissionUserGroupDTO): Promise<any>
  deletePermissionUserGroupDeleteId(id: number): Promise<any>
}
