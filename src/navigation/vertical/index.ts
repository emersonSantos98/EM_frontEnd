import home from './home'
import secondPage from './secondPage'
import rolePermissions from './role&Permissions'
import profile from './profile'
import generateTagZebra from './generateTagZebra'
import generateTagShein from './generateTagShein'
import type { VerticalNavItems } from '@/@layouts/types'

export default [
  ...home,
  ...secondPage,
  ...rolePermissions,
  ...profile,
  ...generateTagZebra,
  ...generateTagShein
] as VerticalNavItems
