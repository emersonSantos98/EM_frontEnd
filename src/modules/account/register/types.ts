export interface IFormIdentificationDTO {
  first_name: string
  last_name: string
  user_type: string
  cellphone: string
}

export interface IFormAccessDTO {
  email: string
  password: string
  passwordConfirmation: string
}

export interface IFormSubscriptionDTO {
  plan_id: number
  payment_method: string
  card_number: string
  card_name: string
  card_expiration_date: string
  card_cvv: string
}

export interface IRegisterSteps {
  title: string
  icon: string
}


export interface IFormRegisterDTO extends IFormIdentificationDTO, IFormAccessDTO {}
