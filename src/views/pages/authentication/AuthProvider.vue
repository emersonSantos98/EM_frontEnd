
<template>
  <div class="d-flex justify-center flex-wrap gap-3">
    <VBtn
      v-for="link in authProviders"
      :key="link.icon"
      icon
      variant="tonal"
      size="38"
      :color="link.color"
      class="rounded"
      @click="handleAuthProviderClick(link)"
    >
      <VIcon
        size="18"
        :icon="link.icon"
      />
    </VBtn>


  </div>
</template>

<script setup lang="ts">



const authProviders = [
  {
    icon: 'fa-facebook',
    color: '#4267b2',
  },
  {
    icon: 'fa-google',
    color: '#dd4b39',
  },
  {
    icon: 'fa-twitter',
    color: '#1da1f2',
  },
];


const handleAuthProviderClick = (link) => {
  if (link.icon === 'fa-google') {
     handleGoogleLogin();
  }
};

const handleGoogleLogin = async () => {
  const googleAuth = VueGoogleOAuth2.init({
    clientId: '247306928090-nmeselbim1jgm3tg98aa0v7g22s63osb.apps.googleusercontent.com',
    scope: 'email',
    prompt: 'consent',
  });
  googleAuth.signIn().then((googleUser) => {
    // Autenticação bem-sucedida. Acesse o token de acesso e outras informações do usuário aqui.
    const idToken = googleUser.getAuthResponse().id_token;
    console.log('idToken', idToken )


  });

};
</script>
