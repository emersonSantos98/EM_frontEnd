<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import type {IFormAccessDTO} from '@/views/register/models/types'
import type {VForm} from 'vuetify/components/VForm'
import {requiredValidator, emailValidator, min, confirmedValidator} from '@validators'
import RegisterService from "@/views/register/register.service";

const registerService = new RegisterService()

interface Props {
  currentStep?: number
  registerData: IFormAccessDTO
}

interface Emit {
  (e: 'update:currentStep', value: number): void

  (e: 'update:register-data', value: IFormAccessDTO): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const registerAcessDataLocal = ref(props.registerData)

const updateAddressData = () => {
  emit('update:register-data', registerAcessDataLocal.value)
}

const nextStep = () => {
  updateAddressData()
  emit('update:currentStep', props.currentStep ? props.currentStep + 1 : 1)
}

const backStep = () => {
  updateAddressData()
  emit('update:currentStep', props.currentStep ? props.currentStep - 1 : 1)
}

watch(() => props.currentStep, updateAddressData)

const firstName = ref('')
const email = ref('')

const refForm = ref<VForm>()

const isPasswordVisible = ref(false)
const isPasswordConfirmationVisible = ref(false)

const handleSubmit = async () => {
  const {valid} = await refForm.value?.validate()
  if (valid) {
    await registerService.authRegister()
    nextStep()
  }

}
</script>

<template>
  <VRow>
    <VCol
      cols="12"
    >
      <h6 class="text-base font-weight-regular mb-4">
        {{ $t('title_register_access') }}
      </h6>
    </VCol>
    <VCol cols="12">
      <VForm
        ref="refForm"
        @submit.prevent="() => {}"
      >
        <VRow>
          <VCol
            cols="12"
          >
            <AppTextField
              v-model="registerAcessDataLocal.email"
              :label="$t('email')"
              :rules="[requiredValidator(registerAcessDataLocal.email, $t('email')), emailValidator]"
            />
          </VCol>
          <VCol
            cols="12"
          >
            <AppTextField
              v-model="registerAcessDataLocal.password"
              :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye' "
              :label="$t('password')"
              :rules="[
                requiredValidator(registerAcessDataLocal.password, $t('password')),
                min(registerAcessDataLocal.password, 8, $t('password')),
                ]"
              :type="isPasswordVisible ? 'text' : 'password'"
              name="password"
              id="password"
              autocomplete="off"
              :hint="$t('At least 8 characters')"
              counter
              @click:append-inner="isPasswordVisible = !isPasswordVisible"
            />
          </VCol>


          <VCol
            cols="12"
          >
            <AppTextField
              v-model="registerAcessDataLocal.passwordConfirmation"
              :append-inner-icon="isPasswordConfirmationVisible ? 'tabler-eye-off' : 'tabler-eye' "
              :label="$t('confirm_password')"
              :rules="[
                requiredValidator(registerAcessDataLocal.passwordConfirmation, $t('confirm_password')),
                min(registerAcessDataLocal.password, 8, $t('confirm_password')),
                confirmedValidator(registerAcessDataLocal.passwordConfirmation, registerAcessDataLocal.password, $t('confirm_password'))
                ]"
              :type="isPasswordConfirmationVisible ? 'text' : 'password'"
              name="passwordConfirmation"
              id="passwordConfirmation"
              autocomplete="off"
              :hint="$t('At least 8 characters')"
              counter
              @click:append-inner="isPasswordConfirmationVisible = !isPasswordConfirmationVisible"
            />
          </VCol>

          <VCol cols="12" class="d-flex justify-space-between">
            <VBtn
              type="submit"
              @click="backStep"
              prepend-icon="mdi-arrow-left"
              variant="plain"
            >
              {{ $t('back') }}
            </VBtn>
            <VBtn
              type="submit"
              @click="handleSubmit"
            >
              {{ $t('finish') }}
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCol>
  </VRow>
</template>
