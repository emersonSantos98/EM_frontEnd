<script lang="ts" setup>
import type { VForm } from 'vuetify/components/VForm'
import { confirmedValidator, passwordValidator, requiredValidator } from '@validators'
import SecurityService from "@/services/security/security.service";

const securityService = new SecurityService;
const refForm = ref<VForm | null>(null);
async function changePassword() {
  await securityService.postSecurityChangePassword()
}
async function twoFactor() {
  await securityService.putSecuritTwoFactor()
}

const usuario = JSON.parse(localStorage.getItem("userData") || "{}"); // Certifique-se de que o valor seja um objeto
securityService.securityStore.formSecurityTwoFactor.two_factor = usuario.two_factor
securityService.securityStore.formSecurityTwoFactor.user_id = usuario.id

function enable2FA() {
  securityService.securityStore.formSecurityTwoFactor.two_factor = 1
  twoFactor()
}
function disable2FA() {
  securityService.securityStore.formSecurityTwoFactor.two_factor = 0
  twoFactor()
}
function onSubmit() {
  if (refForm.value) {
    refForm.value.validate()
      .then(({ valid: isValid }) => {
        if (isValid) {
          changePassword();
          setTimeout(() => {
            refForm.value.reset();
          }, 0);
        }
      });
  }
}
</script>

<template>
  <VRow>
    <!-- SECTION: Change Password -->
    <VCol cols="12">
      <VCard title="Change Password">
        <VForm @submit.prevent ref="refForm">
          <VCardText class="pt-0">
            <!-- 👉 Current Password -->
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 current password -->
                <AppTextField
                  v-model="securityService.securityStore.formSecurityChangePassword.passwordOld"
                  type="password"
                  placeholder="Current Password"
                  persistent-placeholder
                  :rules="[requiredValidator, passwordValidator]"
                  autocomplete="on"
                />
              </VCol>
            </VRow>
            <!-- 👉 New Password -->
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="securityService.securityStore.formSecurityChangePassword.newPassword"
                  type="password"
                  placeholder="New Password"
                  persistent-placeholder
                  :rules="[requiredValidator, passwordValidator]"
                  autocomplete="on"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="securityService.securityStore.formSecurityChangePassword.newPasswordConfirmation"
                  type="password"
                  placeholder="Confirm Password"
                  persistent-placeholder
                  :rules="[requiredValidator, confirmedValidator(securityService.securityStore.formSecurityChangePassword.newPasswordConfirmation, securityService.securityStore.formSecurityChangePassword.newPassword)]"
                  autocomplete="on"
                />
              </VCol>
            </VRow>
          </VCardText>

          <!-- 👉 Password Requirements -->
          <VCardText>
            <h6 class="text-base font-weight-medium mb-3">
              Password Requirements:
            </h6>

            <VList class="card-list">
              <VListItem
                v-for="item in securityService.securityStore.passwordRequirements"
                :key="item"
                :title="item"
                class="text-medium-emphasis"
              >
                <template #prepend>
                  <VIcon
                    size="8"
                    icon="tabler-circle"
                    class="me-3"
                  />
                </template>
              </VListItem>
            </VList>
          </VCardText>

          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">

            <VBtn
              type="submit"
              @click="onSubmit"
            >
              Submit
            </VBtn>
            <VBtn
              type="reset"
              color="secondary"
              variant="tonal"
            >
              Reset
            </VBtn>
          </VCardText>
        </VForm>
      </VCard>
    </VCol>
    <VCol cols="12">
      <VCard title="Two-steps verification">
        <VCardText>
          <h6 class="text-base font-weight-medium mb-3">
            Two factor authentication is  <span v-if="securityService.securityStore.formSecurityTwoFactor.two_factor === 0">not </span> enabled.
          </h6>
          <p>
            Two-factor authentication adds an additional layer of security to your account by
            <br>
            requiring more than just a password to log in.
          </p>

          <VBtn
            :loading="securityService.securityStore.loading"
            v-show="securityService.securityStore.formSecurityTwoFactor.two_factor === 0"
            @click="enable2FA()">
            Enable 2FA
          </VBtn>
          <VBtn
            :loading="securityService.securityStore.loading"
            v-show="securityService.securityStore.formSecurityTwoFactor.two_factor === 1"
            @click="disable2FA()">
            Disable 2FA
          </VBtn>

        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <!-- SECTION Enable One time password -->
  <!--  <TwoFactorAuthDialog v-model:isDialogVisible="securityService.securityStore.isOneTimePasswordDialogVisible" />-->
  <!-- !SECTION -->
</template>

<style lang="scss">
.card-list {
  --v-card-list-gap: 5px;
}

.server-close-btn {
  inset-inline-end: 0.5rem;
}
.validation-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
</style>
