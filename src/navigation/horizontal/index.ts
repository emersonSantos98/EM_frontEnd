import home from './home'
import secondPage from './secondPage'
import calculator from './calculator'
import rolePermissions from './role&Permissions'
import profile from './profile'

import type { VerticalNavItems } from '@/@layouts/types'

export default [
  ...home,
  ...secondPage,
  ...calculator,
  ...rolePermissions,
  ...profile,
] as VerticalNavItems
