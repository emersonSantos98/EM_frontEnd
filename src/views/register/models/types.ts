export interface IFormIdentificationDTO {
  first_name: string
  last_name: string
  user_type: string
  cellphone: string
  document: string
  birth_date: string
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

export interface CartItem {
  id:number
  name: string
  seller: string
  inStock: boolean
  rating: number
  price: number
  discountPrice: number
  image: string
  quantity: number
  estimatedDelivery:  string
}
export interface Addresses {
  title: string
  desc: string
  subtitle: string
  value: string
}

export interface CheckoutData {
  cartItems: CartItem[]
  promoCode: string
  orderAmount: number
  deliveryAddress: string
  deliverySpeed: string
  deliveryCharges: number
  addresses: Addresses[]
}
