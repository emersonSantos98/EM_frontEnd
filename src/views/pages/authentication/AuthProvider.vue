<script setup lang="ts">
import { ref } from 'vue'
import svgGoogle from '@/assets/images/iconify-svg/fa-google.svg'

const authProviders = [
  {
    icon: svgGoogle,
    color: 'secondary',
    title: ' Google',
  },
]

function handleAuthProviderClick(link) {
  if (link.icon === svgGoogle)
    handleGoogleLogin()
}

async function handleGoogleLogin() {
  const googleAuth = VueGoogleOAuth2.init({
    clientId: '247306928090-nmeselbim1jgm3tg98aa0v7g22s63osb.apps.googleusercontent.com',
    scope: 'email',
    prompt: 'consent',
  })

  googleAuth.signIn().then(googleUser => {
    // Autenticação bem-sucedida. Acesse o token de acesso e outras informações do usuário aqui.
    const idToken = googleUser.getAuthResponse().id_token

    console.log('idToken', idToken)
  })
}
</script>

<template>
  <div class="d-flex justify-center flex-wrap gap-3">
    <VBtn
      v-for="link in authProviders"
      :key="link.icon"
      variant="outlined"
      size="x-large"
      :color="link.color"
      @click="handleAuthProviderClick(link)"
    >
      <img :src="link.icon" alt="icon" width="27" height="27" />
      <span class="text-black" style="text-transform: capitalize;">{{ link.title }}</span>
    </VBtn>
  </div>
</template>

<style scoped>
.text-black {
  color: rgb(0, 0, 0, 0.67) !important;
  font-size: .875rem;
}
</style>
