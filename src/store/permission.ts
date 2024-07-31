import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { IPermission } from '@types/types'
import type { IPagination } from '@/services/Permission/intefaces'

export const usePermissionStore = defineStore('Permission', () => {
  const permission = ref<IPermission>({
    subjects: '',
    actions: '',
    id: null,
  })

  const setPermission = (perm: IPermission) => {
    permission.value = perm
  }

  const convertePermissionsUnique = (permissions: IPermission[]) => {
    const entityMap = {}

    for (const item of permissions) {
      const { actions, subjects } = item

      if (!entityMap[subjects])
        entityMap[subjects] = []

      entityMap[subjects].push(actions)
    }

    for (const entity in entityMap)
      entityMap[entity] = Array.from(new Set(entityMap[entity]))

    const resultado = []

    for (const entity in entityMap)
      resultado.push({ name: entity, actions: entityMap[entity] })

    return resultado
  }

  const resetPermission = () => {
    permission.value = {
      subjects: '',
      actions: '',
      id: null,
    }
  }

  const deleteOnePermission = (id: number) => {
    const index = permissions.value.findIndex(item => item.id === id)

    permissions.value.splice(index, 1)
  }

  const isLoading = ref<boolean>(false)

  const pagination = reactive<IPagination>({
    page: 1,
    perPage: 100,
    sortBy: 'id',
    sortDesc: false,
  })

  const setPagination = (pg: IPagination) => {
    pagination.page = pg.page
    pagination.perPage = pg.perPage
    pagination.sortBy = pg.sortBy
    pagination.sortDesc = pg.sortDesc
    pagination.total = pg.total
  }

  const permissions = ref<IPermission[]>([])

  const getPermissions = computed(() => {
    return convertePermissionsUnique(permissions.value)
  })

  const addPermission = (permission: IPermission) => {
    permissions.value.push(permission)
  }

  return {
    permission,
    setPermission,
    resetPermission,
    getPermissions,
    deleteOnePermission,
    isLoading,
    permissions,
    addPermission,
    pagination,
    setPagination,
  }
},
)

export interface IUsePermissionStore {
  permission: IPermission
  setPermission: (permission: IPermission) => void
  getPermissions: ComputedRef<IPermission[]>
  resetPermission: () => void
  isLoading: boolean
  permissions: IPermission[]
  pagination: IPagination
  addPermission: (permission: IPermission) => void
  setPagination: (pagination: IPagination) => void
  deleteOnePermission: (id: number) => void
}
