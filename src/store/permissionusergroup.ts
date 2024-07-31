import {ref, reactive} from 'vue'
import {defineStore} from 'pinia'
import {IPermissionGroup} from "@types/types";

export const usePermissionUserGroupStore = defineStore('PermissionUserGroup', () => {
    const permissionUserGroup = reactive<IPermissionGroup>({
      id_usergroup: null,
      id_permission: null,
    })

  const permissionUserGroups = ref<IPermissionGroup[]>([])
    return {
      permissionUserGroup,
      permissionUserGroups,
    }
  }
)

export interface IUsePermissionUserGroupStore {
  permissionUserGroup: IPermissionGroup
  permissionUserGroups: IPermissionGroup[]
}
