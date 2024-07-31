import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { IUserGroupDTO } from '@/api/UserGroup/models/types'

export const useUserGroupStore = defineStore('UserGroup', () => {
  const userGroup = reactive<IUserGroupDTO>({
    id_usergroup: null,
    id_permission: null,
  })

  const userGroups = ref<IUserGroupDTO[]>([])

  const addUserGroup = (userGroup: IUserGroupDTO) => {
    userGroups.value.push(userGroup)
  }

  return {
    userGroup,
    userGroups,
    addUserGroup,
  }
},
)

export interface IUseUserGroupStore {
  userGroup: IUserGroupDTO
  userGroups: IUserGroupDTO[]
  addUserGroup: (userGroup: IUserGroupDTO) => void
}
