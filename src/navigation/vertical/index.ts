import home from './home'
import rolePermissions from './role&Permissions'
import shippingLabels from './shippingLabels'
import workshop from './workshop'
import type { VerticalNavItems } from '@/@layouts/types'

export default [
  ...home,
  ...rolePermissions,
  ...shippingLabels,
  ...workshop,
] as VerticalNavItems
