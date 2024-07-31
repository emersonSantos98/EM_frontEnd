import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export interface IFormChangePasswordDTO {
  passwordOld: string | null
  newPassword: string | null
  newPasswordConfirmation: string | null
}
export interface IFormResetPasswordDTO {
  user_id: string | null
  newPassword: string | null
  newPasswordConfirmation: string | null
}
export interface IFormForgotPasswordDTO {
  email: string | null
  type: string | null
}
export interface IFormValidCodeDTO {
  code: number | null
  user_id: string | null
  type: string | null
}
export interface IFormTwoFactorDTO {
  two_factor: number | null
  user_id: string | null
}

export const useSecurityStore = defineStore('security', () => {
  const isCurrentPasswordVisible = ref(false)
  const isNewPasswordVisible = ref(false)
  const isConfirmPasswordVisible = ref(false)

  const formSecurityChangePassword = reactive<IFormChangePasswordDTO>({
    newPassword: '',
    passwordOld: '',
    newPasswordConfirmation: '',
  })

  const formSecurityResetPassword = reactive<IFormResetPasswordDTO>({
    user_id: null,
    newPassword: null,
    newPasswordConfirmation: null,
  })

  const formSecurityForgotPassword = reactive<IFormForgotPasswordDTO>({
    email: '',
    type: '',
  })

  const formSecurityValidCode = reactive<IFormValidCodeDTO>({
    code: null,
    user_id: null,
    type: null,
  })

  const formSecurityTwoFactor = reactive<IFormTwoFactorDTO>({
    two_factor: null,
    user_id: null,
  })

  const loading = ref<boolean>(false)
  const setLoading = (value: boolean) => (loading.value = value)

  const passwordRequirements = [
    'Minimum 8 characters long - the more, the better',
    'At least one lowercase character',
    'At least one number, symbol, or whitespace character',
  ]

  const isOneTimePasswordDialogVisible = ref(false)
  const email = ref('')

  return {
    isCurrentPasswordVisible,
    isNewPasswordVisible,
    isConfirmPasswordVisible,
    formSecurityChangePassword,
    formSecurityResetPassword,
    formSecurityForgotPassword,
    formSecurityValidCode,
    formSecurityTwoFactor,
    loading,
    setLoading,
    passwordRequirements,
    isOneTimePasswordDialogVisible,
    email,
  }
})

export interface IUserSecurityStore {
  isCurrentPasswordVisible: boolean
  isNewPasswordVisible: boolean
  isConfirmPasswordVisible: boolean
  loading: boolean
  setLoading: (value: boolean) => void
  formSecurityChangePassword: IFormChangePasswordDTO
  formSecurityResetPassword: IFormResetPasswordDTO
  formSecurityForgotPassword: IFormForgotPasswordDTO
  formSecurityValidCode: IFormValidCodeDTO
  formSecurityTwoFactor: IFormTwoFactorDTO
  passwordRequirements: string[]
  isOneTimePasswordDialogVisible: boolean
}
