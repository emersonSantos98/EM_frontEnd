import type {IFormAccessDTO, IFormIdentificationDTO,} from '@/modules/account/list/register/models/types'
import {IFormSubscriptionDTO, IRegisterSteps} from "@/modules/account/list/register/models/types";
import i18n from "@/plugins/i18n";
const $t = i18n.global.t
export const useRegisterStore = defineStore('useRegisterStore', () => {
  const formIdentification = reactive<IFormIdentificationDTO>({
    first_name: '',
    last_name: '',
    user_type: 'cliente',
    cellphone: '',
    document: '',
    birth_date: '',
  })

  const formAccess = reactive<IFormAccessDTO>({
    email: '',
    password: '',
    passwordConfirmation: '',
  })

  const formSubscription = reactive<IFormSubscriptionDTO>({
    plan_id: 1,
    payment_method: 'credit_card',
    card_number: '',
    card_name: '',
    card_expiration_date: '',
    card_cvv: '',
  })

  const getFormRegister = computed<IFormRegisterDTO>(() => ({
    ...formIdentification,
    ...formAccess,
  }))

  const registerSteps = reactive<IRegisterSteps>([
    {
      title: $t('identification'),
      icon: 'tabler-circle-number-1',
    },
    {
      title: $t('access'),
      icon: 'tabler-circle-number-2',
    },
    {
      title: $t('conclusion'),
      icon: 'tabler-check',
    },
  ])

  const isPasswordVisible = ref(false)

  const loading = ref(false)

  return {
    isPasswordVisible,
    loading,
    formIdentification,
    formAccess,
    registerSteps,
    getFormRegister,
    formSubscription,
  }
})

export interface IRegisterStore {
  isPasswordVisible: boolean
  loading: boolean
  formIdentification: IFormIdentificationDTO
  formAccess: IFormAccessDTO
  getFormRegister: IFormRegisterDTO
  registerSteps: IRegisterSteps
  formSubscription: IFormSubscriptionDTO
}
