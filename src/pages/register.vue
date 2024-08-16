<script setup lang="ts">
import Access from '@/views/register/components/Access/Index.vue'
import Identification from '@/views/register/components/Identification/Index.vue'
import Subscription from '@/views/register/components/Subscription/Index.vue'
import AppStepper from '@/views/register/components/AppStepper.vue'
import SetpLayout from '@/views/register/components/SetpLayout.vue'
import RegisterService from '@/views/register/register.service'

const registerService = new RegisterService()

const currentStep = ref(0)
</script>

<template>
  <div class="main-register">
    <VCard width="900">
      <VCardText>
        <!-- 👉 Stepper -->
        <AppStepper
          v-model:current-step="currentStep"
          class="checkout-stepper"
          :items="registerService.store.registerSteps"
          :direction="$vuetify.display.smAndUp ? 'horizontal' : 'vertical'"
        />
      </VCardText>

      <VDivider />

      <VCardText>
        <!-- 👉 stepper content -->
        <VWindow
          v-model="currentStep"
          class="disable-tab-transition"
        >
          <VWindowItem>
            <SetpLayout>
              <Identification
                v-model:current-step="currentStep"
                v-model:register-data="registerService.store.formIdentification"
              />
            </SetpLayout>
          </VWindowItem>

          <VWindowItem>
            <SetpLayout>
              <Access
                v-model:current-step="currentStep"
                v-model:register-data="registerService.store.formAccess"
              />
            </SetpLayout>
          </VWindowItem>

          <VWindowItem>
            <SetpLayout>
              <Subscription
                v-model:current-step="currentStep"
                v-model:register-data="registerService.store.formSubscription"
              />
            </SetpLayout>
          </VWindowItem>
        </VWindow>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
.checkout-stepper {
  .stepper-icon-step {
    .step-wrapper + svg {
      margin-inline: 3.5rem !important;
    }
  }
}

.main-register {
  height: 100vh;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
</route>
