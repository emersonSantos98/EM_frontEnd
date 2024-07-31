export interface IPagination {
  page: number,
  perPage: number,
  sortBy: string
  sortDesc: boolean
  total: number
}


export interface IPermissionRole {
  name: string
  subjects: string
}
