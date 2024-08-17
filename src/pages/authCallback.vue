<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/store/auth'
import { useAppAbility } from '@/plugins/casl/useAppAbility'
import Notifier from '@core/utils/Notifier'

const notifier = new Notifier()
const ability = useAppAbility()
const authUser = useAuthStore()
const route = useRoute()
const router = useRouter()

onMounted(async () => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/auth/login/success`
    const { data } = await axios.get(url, { withCredentials: true })
    if (data && !data.error) {
      const { user } = data

      ability.update(user.userAbilities as any)
      authUser.setUser(user.userData)
      authUser.setDadosTemporario(user.refreshToken, user.accessToken, user.userAbilities)
      authUser.setToken(user.accessToken)
      authUser.setRefreshToken(user.refreshToken)
      authUser.setAbilities(user.userAbilities)
      authUser.setIsAuth(true)
      notifier.success('Login realizado com sucesso!')
      await nextTick(() => {
        router.replace(route.query.to ? String(route.query.to) : '/')
      })
    }
    else {
      throw new Error('Erro ao processar o login com Google')
    }
  }
  catch (err) {
    console.log(err)
  }
  // try {
  //   // Faz a requisição para verificar o sucesso do login
  //   const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login/success`, {
  //     credentials: 'include',
  //   })
  //
  //   const result = await response.json()
  //
  //   if (result && !result.error) {
  //     const { user } = result
  //
  //     ability.update(user.userAbilities as any)
  //     authUser.setUser(user.userData)
  //     authUser.setDadosTemporario(user.refreshToken, user.accessToken, user.userAbilities)
  //     authUser.setToken(user.accessToken)
  //     authUser.setRefreshToken(user.refreshToken)
  //     authUser.setAbilities(user.userAbilities)
  //     authUser.setIsAuth(true)
  //     notifier.success('Login realizado com sucesso!')
  //
  //     router.push({ name: 'index' })
  //   }
  //   else {
  //     throw new Error('Erro ao processar o login com Google')
  //   }
  // }
  // catch (err) {
  //   console.error('Erro no callback do Google:', err)
  //   router.push({ name: 'login' }) // Redireciona para o login em caso de erro
  // }
})
</script>

<template>
  <div>Processando login...</div>
</template>

<route lang="yaml">
name: authCallback
meta:
  layout: blank
  action: read
  subject: Auth
</route>
