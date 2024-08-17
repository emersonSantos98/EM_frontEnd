import home from './home'
import rolePermissions from './role&Permissions'
import shippingLabels from './shippingLabels'
import type { VerticalNavItems } from '@/@layouts/types'

export default [
  ...home,
  ...rolePermissions,
  ...shippingLabels,
] as VerticalNavItems
