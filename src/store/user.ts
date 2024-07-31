import {ref} from 'vue'
import {defineStore} from 'pinia'
import {IUser} from "@types/types";
import {IQueriesUser} from "@/services/User/models";

export const useUserStore = defineStore('User', () => {
    const user = ref<IUser>({
      status: 1,
      user_group_id: 2,
    })

    const users = ref<IUser[]>([])

    const queriesUser = ref<IQueriesUser>({
      page: 1,
      limit: 10,
      q: '',
      status: '',
      user_group_id: '',
      role: '',
    })

  const setQueriesUser = (queries: IQueriesUser) => {
    queriesUser.value = {
      ...queries,
    }
  }
    const isUpdate = ref<boolean>(false)

    const setUser = (us: IUser) => {
      user.value = {
        ...us,
      }
    }

    const setUsers = (us: IUser[]) => {
      users.value = JSON.parse(JSON.stringify(us))
    }

    const setIsUpdate = (value: boolean) => {
      isUpdate.value = value
    }
    const updateUserInUsers = (us: IUser) => {
      const usuario = users.value.find((u) => u.id === us.id)
      if (usuario) {
        const index = users.value.indexOf(usuario)
        users.value[index] = us
      }
    }

    const resetUser = () => {
      user.value = {
        status: 1,
        user_group_id: 2,
      }
    }

    const totalUsers = ref<number>(0)
    const addUser = (user: IUser) => {
      users.value.push(user)
    }
    return {
      user,
      users,
      isUpdate,
      totalUsers,
      addUser,
      setUser,
      resetUser,
      updateUserInUsers,
      setIsUpdate,
      setUsers,
      setQueriesUser,
    }
  }
)

export interface IUseUserStore {
  user: IUser
  users: IUser[]
  totalUsers: number
  isUpdate: boolean
  addUser: (user: IUser) => void
  setUser: (user: IUser) => void
  updateUserInUsers: (user: IUser) => void
  resetUser: () => void
  setIsUpdate: (value: boolean) => void
  setUsers: (users: IUser[]) => void
  setQueriesUser: (queries: any) => void
}
