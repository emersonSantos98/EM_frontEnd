<script setup lang="ts">
import {VForm} from 'vuetify/components'
import {onMounted} from 'vue'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'

import {useGenerateImageVariant} from '@core/composable/useGenerateImageVariant'
import {VNodeRenderer} from '@layouts/components/VNodeRenderer'
import {themeConfig} from '@themeConfig'
import {emailValidator, requiredValidator} from '@validators'
import AuthService from '@/services/auth/auth.service'

import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'

const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

const isPasswordVisible = ref(false)

const route = useRoute()
const router = useRouter()

const authService = new AuthService()

const refVForm = ref<VForm>()

const errors = ref<Record<string, string | undefined>>({
  email: undefined,
  password: undefined,
})

async function login() {
  await authService.authLogin()
  const twoFactor = JSON.parse(localStorage.getItem('userData') || 'null')
  if (twoFactor.two_factor === 1) {
    await router.push({name: 'verify-code'})
  } else {
    await router.push({name: 'index'})
  }
}

function onSubmit() {
  refVForm.value?.validate()
    .then(({valid: isValid}) => {
      if (isValid)
        login()
    })
}

onMounted(() => {
  authService.loginStore.getRememberMyPassword()
})
</script>

<template>
  <VRow
    no-gutters
    class="auth-wrapper"
  >
    <VCol
      lg="8"
      class="d-none d-lg-flex"
    >
      <div class="position-relative auth-bg rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="505"
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg
          :src="authThemeMask"
          class="auth-footer-mask"
        />
      </div>
    </VCol>

    <VCol
      cols="12"
      lg="4"
      class="d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4"
      >
        <VCardText>
          <VNodeRenderer
            :nodes="themeConfig.app.logo"
            class="mb-6"
          />

          <h5 class="text-h5 font-weight-semibold mb-1">
            Bem-vindo ao {{ themeConfig.app.title }}! 👋🏻
          </h5>
          <p class="mb-0">
            Inicie sessão na sua conta e comece a aventura
          </p>
        </VCardText>
        <VCardText>
          <VForm
            ref="refVForm"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="authService.loginStore.formLogin.email"
                  label="Email"
                  type="email"
                  :rules="[requiredValidator, emailValidator]"
                  :error-messages="errors.email"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="authService.loginStore.formLogin.password"
                  label="Password"
                  :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :error-messages="errors.email"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center mt-2 mb-4">
                  <div style="width: 130px">
                    <VCheckbox
                      v-model="authService.loginStore.rememberMyPassword"
                      :label="$t('Remember me')"
                    />
                  </div>
                  <VSpacer/>
                  <RouterLink
                    class="text-primary ms-2 mb-1"
                    :to="{ name: 'secuirity.forgot-password' }"
                  >
                    Forgot Password?
                  </RouterLink>
                </div>
                <VBtn
                  block
                  :loading="authService.loginStore.loading"
                  type="submit"
                >
                  Login
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol
                cols="12"
                class="text-center"
              >
                <span>New on our platform?</span>
                <RouterLink :to="{ name: 'register' }">
                  Cria uma conta
                </RouterLink>
              </VCol>
              <VCol
                cols="12"
                class="d-flex align-center"
              >
                <VDivider/>
                <span class="mx-4">or</span>
                <VDivider/>
              </VCol>

              <!-- auth providers -->
              <VCol
                cols="12"
                class="text-center"
              >
                <AuthProvider/>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss" src="src/views/login/login.scss" scoped></style>


<route lang="yaml">
name: login
meta:
  layout: blank
  action: read
  subject: Auth
</route>
