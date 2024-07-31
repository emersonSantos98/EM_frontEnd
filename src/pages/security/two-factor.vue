<script setup lang="ts">
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2ForgotPasswordIllustrationDark from '@images/pages/auth-v2-two-step-illustration-dark.png'
import authV2ForgotPasswordIllustrationLight from '@images/pages/auth-v2-two-step-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
const router = useRouter()
import SecurityService from "@/services/security/security.service";
const securityService = new SecurityService;
const authThemeImg = useGenerateImageVariant(
  authV2ForgotPasswordIllustrationLight,
  authV2ForgotPasswordIllustrationDark,
)
const route = useRoute()
async function limparStorage(){
  localStorage.removeItem("email_to");
  localStorage.removeItem("user_id");
}
async function onResend() {
  securityService.securityStore.formSecurityForgotPassword.email = localStorage.getItem("email_to")
  await securityService.postSecurityForgotPassword()
}
async function onSubmit (newValue) {
  securityService.securityStore.formSecurityValidCode.code = newValue
  securityService.securityStore.formSecurityValidCode.user_id = localStorage.getItem("user_id")
  securityService.securityStore.formSecurityValidCode.type = 'resetPassword'
  await securityService.postSecurityValidCode()
  router.push({ name: 'secuirity.reset-password' })
}
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
</script>

<template>
  <VRow
    class="auth-wrapper bg-surface"
    no-gutters
  >
    <VCol
      md="8"
      class="d-none d-md-flex"
    >
      <div class="position-relative bg-background rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="418"
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
      md="4"
      class="auth-card-v2 d-flex align-center justify-center"
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
            Two Step Verification 💬
          </h5>
          <p class="mb-2">
            We sent a verification code to your email. Enter the code from the email in the field below.
          </p>
          <h6 class="text-base font-weight-medium">
            ******1234
          </h6>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="() => {}">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppOtpInput @updateOtp="onSubmit" />
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
              <VCol cols="12">
                <div class="d-flex justify-center align-center flex-wrap">
                  <span class="me-1">Didn't get the code?</span>
                  <VBtn
                    :loading="securityService.securityStore.loading"
                    @click="onResend()"
                    type="submit"
                  >
                    Resend
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>

<route lang="yaml" scoped>
name: secuirity.two-factor
meta:
  layout: blank
</route>
