export interface IOptionsPagination {
  page: number,
  itemsPerPage: number,
  sortBy: string[],
  groupBy: string[],
  search: string,
}
export interface IQueryUser {
  q?: string
  options?: IOptionsPagination
}
export interface IUserClient {
  postUserCreate(dataBody: IUserDTO): Promise<any>
  getUserFindAll(query: IQueryUser): Promise<any>
  getUserFindOneId(id: number): Promise<any>
  putUserUpdateId(id: number, dataBody: IUserDTO): Promise<any>
  deleteUserDeleteId(id: number): Promise<any>
}
