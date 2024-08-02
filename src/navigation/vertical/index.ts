import home from './home'
import rolePermissions from './role&Permissions'
import type { VerticalNavItems } from '@/@layouts/types'

export default [
  ...home,
  ...rolePermissions,
] as VerticalNavItems
