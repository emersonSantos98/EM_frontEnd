<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import type {IFormIdentificationDTO} from '@/modules/account/list/register/models/types'
import {min, requiredValidator} from '@validators'

interface Props {
  currentStep?: number
  registerData: IFormIdentificationDTO
}

interface Emit {
  (e: 'update:currentStep', value: number): void

  (e: 'update:register-data', value: IFormIdentificationDTO): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const registerIdetificationDataLocal = ref(props.registerData)

const updateAddressData = () => {
  emit('update:register-data', registerIdetificationDataLocal.value)
}

const nextStep = () => {
  updateAddressData()
  emit('update:currentStep', props.currentStep ? props.currentStep + 1 : 1)
}

watch(() => props.currentStep, updateAddressData)

const refForm = ref<VForm>()

const handleSubmit = async () => {
  const {valid} = await refForm.value?.validate()
  if (valid) {
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
        {{ $t('title_register_identification') }}
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
            sm="6"
          >
            <AppTextField
              v-model="registerIdetificationDataLocal.first_name"
              name="first_name"
              id="first_name"
              :label="$t('name')"
              :rules="[
                requiredValidator(registerIdetificationDataLocal.first_name, $t('name')),
                min(registerIdetificationDataLocal.first_name, 3, $t('name'))
              ]"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <AppTextField
              v-model="registerIdetificationDataLocal.last_name"
              :label="$t('surname')"
              :rules="[
                requiredValidator(registerIdetificationDataLocal.last_name, $t('surname')),
                min(registerIdetificationDataLocal.last_name, 3, $t('surname'))
              ]"
            />
          </VCol>


          <VCol
            cols="12"
          >
            <AppTextField
              v-model="registerIdetificationDataLocal.cellphone"
              :label="$t('cell_phone')"
              v-mask="['(##) #####-####', '(##) ####-####']"
              :rules="[requiredValidator(registerIdetificationDataLocal.cellphone, $t('cell_phone'))]"
            />
          </VCol>
          <VCol
            cols="12"
          >
            <AppTextField
              v-model="registerIdetificationDataLocal.document"
              :label="$t('document')"
              v-mask="['###.###.###-##', '##.###.###/####-##']"
              :rules="[requiredValidator(registerIdetificationDataLocal.document, $t('document'))]"
            />
          </VCol>

          <VCol
            cols="12"
          >
            <AppTextField
              v-model="registerIdetificationDataLocal.birth_date"
              :label="$t('birth_date')"
              v-mask="['##/##/####']"
              :rules="[requiredValidator(registerIdetificationDataLocal.birth_date, $t('birth_date'))]"
            />
          </VCol>

          <VCol cols="12" class="d-flex justify-space-between">
            <VBtn
              type="reset"
              variant="outlined"
              :to="{ name: 'login' }"
            >
              {{ $t('back login') }}
            </VBtn>
            <VBtn
              type="submit"
              @click="handleSubmit"
            >
              {{ $t('continue') }}
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCol>
  </VRow>
</template>
