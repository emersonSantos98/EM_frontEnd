<script setup lang="ts">
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { confirmedValidator, passwordValidator, requiredValidator } from '@validators'
import authV2ResetPasswordIllustrationDark from '@images/pages/auth-v2-reset-password-illustration-dark.png'
import authV2ResetPasswordIllustrationLight from '@images/pages/auth-v2-reset-password-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import SecurityService from "@/services/security/security.service";
import {VForm} from "vuetify/components/VForm";
const securityService = new SecurityService;
const router = useRouter()
const refForm = ref<VForm | null>(null);
const email = localStorage.getItem("email_to")
const user_id = localStorage.getItem("user_id")
const authThemeImg = useGenerateImageVariant(authV2ResetPasswordIllustrationLight,
  authV2ResetPasswordIllustrationDark,
)
const route = useRoute()
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
async function limparStorage(){
  localStorage.removeItem("email_to");
  localStorage.removeItem("user_id");
}
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
async function resetPassword () {
  securityService.securityStore.formSecurityResetPassword.user_id = user_id
  await securityService.postSecurityResetPassword()
  await router.push({ name: 'login' })
  localStorage.removeItem("email_to");
  localStorage.removeItem("user_id");
}
function onSubmit() {
  if (refForm.value) {
    refForm.value.validate()
      .then(({ valid: isValid }) => {
        if (isValid) {
          resetPassword();
        }
      });
  }
}
</script>

<template>
  <VRow
    no-gutters
    class="auth-wrapper bg-surface"
  >
    <VCol
      md="8"
      class="d-none d-md-flex"
    >
      <div class="position-relative bg-background rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="400"
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
            Reset Password 🔒
          </h5>
          <p class="mb-0">
            for <span class="font-weight-bold">{{ email }}</span>
          </p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="() => {}" ref="refForm">
            <VRow>
              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="securityService.securityStore.formSecurityResetPassword.newPassword"
                  autofocus
                  label="New Password"
                  :rules="[requiredValidator, passwordValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>

              <!-- Confirm Password -->
              <VCol cols="12">
                <AppTextField
                  v-model="securityService.securityStore.formSecurityResetPassword.newPasswordConfirmation"
                  label="Confirm Password"
                  :rules="[requiredValidator, confirmedValidator(securityService.securityStore.formSecurityResetPassword.newPasswordConfirmation, securityService.securityStore.formSecurityResetPassword.newPassword)]"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                />
              </VCol>

              <!-- Set password -->
              <VCol cols="12">
                <VBtn
                  :loading="securityService.securityStore.loading"
                  @click="onSubmit()"
                  block
                  type="submit"
                >
                  Set New Password
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
name: security.reset-password
meta:
  layout: blank
</route>
