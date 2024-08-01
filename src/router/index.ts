import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import { isUserLoggedIn } from './utils'
import routes from '~pages'
import { canNavigate } from '@layouts/plugins/casl'
import { useAuthStore } from '@/store/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      redirect: to => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        const userRole = userData && userData.role ? userData.role : null

        if (userRole === 'admin')
          return { name: 'index' }
        if (userRole === 'user')
          return { name: 'second-page' }

        return { name: 'login', query: to.query }
      },
    },
    ...setupLayouts([...routes]),
  ],

})

router.beforeEach(async (to, from, next) => {
  const isLoggedIn = isUserLoggedIn()
  const routasPublicas = ['login', 'register', 'secuirity.forgot-password', 'secuirity.twoFactor', 'secuirity.reset-password', 'verify-code', 'not-authorized']

  if (!routasPublicas.includes(to.name as string)) {
    const auth = useAuthStore()

    if (!auth.isAuth)
      return next({ name: 'login' })

    // Verifique se o usuário tem permissão para acessar a rota
    if (!canNavigate(to))
      return next({ name: 'not-authorized' })
  }

  // Redirecione se o usuário estiver logado e a rota requerer login
  if (to.meta.redirectIfLoggedIn && isLoggedIn)
    return next('/')

  next()
})

// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards

export default router
