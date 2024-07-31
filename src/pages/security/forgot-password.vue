<script setup lang="ts">
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

import authV2ForgotPasswordIllustrationDark from '@images/pages/auth-v2-forgot-password-illustration-dark.png'
import authV2ForgotPasswordIllustrationLight from '@images/pages/auth-v2-forgot-password-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import SecurityService from "@/services/security/security.service";
import {VForm} from "vuetify/components/VForm";
const router = useRouter()
const securityService = new SecurityService;
const refForm = ref<VForm | null>(null);

const route = useRoute()
const authThemeImg = useGenerateImageVariant(authV2ForgotPasswordIllustrationLight, authV2ForgotPasswordIllustrationDark)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
async function forgotPassword() {
  await securityService.postSecurityForgotPassword()
  await router.push({ name: 'secuirity.two-factor' })
}
async function limparStorage(){
  localStorage.removeItem("email_to");
  localStorage.removeItem("user_id");
}
async function onSubmit() {
  if (refForm.value) {
    refForm.value.validate()
      .then(({ valid: isValid }) => {
        if (isValid) {
          forgotPassword();
        }
      });
  }
}
</script>

<template>
  <VRow
    class="auth-wrapper bg-surface"
    no-gutters
  >
    <VCol
      lg="8"
      class="d-none d-lg-flex"
    >
      <div class="position-relative bg-background rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="368"
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg
          class="auth-footer-mask"
          :src="authThemeMask"
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
          <h5 class="text-h5 mb-1">
            Forgot Password? 🔒
          </h5>
          <p class="mb-0">
            Enter your email and we'll send one code to reset your password
          </p>
        </VCardText>

        <VCardText>
          <VForm ref="refForm" @submit.prevent="() => {} ">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="securityService.securityStore.formSecurityForgotPassword.email"
                  autofocus
                  label="Email"
                  type="email"
                />
              </VCol>

              <!-- Reset link -->
              <VCol cols="12">
                <VBtn
                  :loading="securityService.securityStore.loading"
                  @click="onSubmit"
                  type="submit"
                >
                  Send Reset Code
                </VBtn>
              </VCol>

              <!-- back to login -->
              <VCol cols="12">
                <RouterLink
                  @click="limparStorage()"
                  class="d-flex align-center justify-center"
                  :to="{ name: 'login' }"
                >
                  <VIcon
                    icon="tabler-chevron-left"
                    class="flip-in-rtl"
                  />
                  <span>Back to login</span>
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
@use "@core/scss/template/pages/page-auth";
</style>

<route lang="yaml">
name: secuirity.forgot-password
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
