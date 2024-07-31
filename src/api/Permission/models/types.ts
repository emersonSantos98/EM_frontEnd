import {ICreatePermissionGroup} from "@types/types";

export interface IPermissionDTO {
  id?: number
  actions: string
  subjects: string
  createdAd?: string
  updatedAd?: string
}

export interface IOptionsPagination {
  page: number,
  itemsPerPage: number,
  sortBy: string[],
  groupBy: string[],
  search: string,
}
export interface IQueryPermission {
  q?: string
  options?: IOptionsPagination
}
export interface IPermissionClient {
  postPermissionCreate(dataBody: IPermissionDTO): Promise<any>
  getPermissionFindAll(query: IQueryPermission): Promise<any>
  getPermissionFindOneId(id: number): Promise<any>
  putPermissionUpdateId(id: number, dataBody: IPermissionDTO): Promise<any>
  deletePermissionDeleteId(id: number): Promise<any>
  postPermissionCreatePermissionRole(dataBody: IPermissionDTO): Promise<any>
}
