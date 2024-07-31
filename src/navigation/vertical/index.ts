import home from './home'
import calculator from './calculator'
import rolePermissions from './role&Permissions'
import profile from './profile'
import product from './product'
import reorderLabels from './reorderLabels'
import type { VerticalNavItems } from '@/@layouts/types'

export default [
  ...home,
  ...calculator,
  ...rolePermissions,
  ...profile,
  ...product,
  ...reorderLabels,
] as VerticalNavItems
