<script setup lang="ts">
import svgGoogle from '@/assets/images/iconify-svg/fa-google.svg'
import Notifier from '@core/utils/Notifier'

const notifier = new Notifier()

const authProviders = [
  {
    icon: svgGoogle,
    color: 'secondary',
    title: 'Google',
  },
]

function handleAuthProviderClick(link) {
  if (link.icon === svgGoogle)
    handleGoogleLogin()
}

async function handleGoogleLogin() {
  try {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
  }
  catch (err: any) {
    throw notifier.error('Erro ao tentar autenticar com Google')
  }
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
      <img
        :src="link.icon"
        alt="icon"
        width="27"
        height="27"
      >
      <span
        class="text-black"
        style="text-transform: capitalize;"
      >
        {{ link.title }}
      </span>
    </VBtn>
  </div>
</template>

<style scoped>
.text-black {
  color: rgba(0, 0, 0, 0.67) !important;
  font-size: 0.875rem;
}
</style>
