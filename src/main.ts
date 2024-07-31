import '@/@iconify/icons-bundle'
import { abilitiesPlugin } from '@casl/vue'
import { createPinia } from 'pinia'
import { createApp, markRaw } from 'vue'
import VueTheMask from 'vue-the-mask'
import App from '@/App.vue'
import ability from '@/plugins/casl/ability'
import i18n from '@/plugins/i18n'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import { Toast, optionsToast } from '@/plugins/vueToastification'
import router from '@/router'
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import { useAuthStore } from '@/store/auth'
import index from '/src/pages/index.vue'

loadFonts()

// Create vue app
const app = createApp(App)
const pinia = createPinia()
import VueTheMask from 'vue-the-mask'
import filtersGlobal from "@core/utils/filters.global";


// Use plugins
pinia.use(({ store }) => { store.router = markRaw(router) })
app.use(pinia)
app.use(vuetify)
app.use(router)
app.use(layoutsPlugin)
app.use(i18n)

app.config.globalProperties.$filters = filtersGlobal

app.use(abilitiesPlugin, ability, {
  useGlobalProperties: true,
})
app.use(VueTheMask)

app.use(Toast, optionsToast);
if(localStorage.getItem('accessToken')) {

  (async () => {
    const auth = useAuthStore()
    try {
      auth.setIsAuth(true)

      const tokenIsValid = await auth.checkToken()
      if (!tokenIsValid) {
        const refreshTokenValid = await auth.Tokenrefresh()
        if (!refreshTokenValid)
          auth.setIsAuth(false)
      }
    }
    catch (error) {
      console.log('error', error)
      auth.setIsAuth(false)
    }
  })()
}

// const routes = [
//   {
//     path: '/',
//     name: 'index ',
//     component: index,
//     props: (route: any) => ({
//       accessToken: route.query.access_token,
//       user: JSON.parse(route.query.user),
//     }),
//   },
//
//   // outras rotas
// ]

// Mount vue app
app.mount('#app')
