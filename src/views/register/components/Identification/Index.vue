<script setup lang="ts">
import { ref, watch } from 'vue'
import type { IFormIdentificationDTO } from '@/modules/account/register/types'
import { min, requiredValidator } from '@validators'
import svgGoogle from '@/assets/images/iconify-svg/fa-google.svg'
import Notifier from '@core/utils/Notifier'

const notifier = new Notifier()
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

function updateAddressData() {
  emit('update:register-data', registerIdetificationDataLocal.value)
}

function nextStep() {
  updateAddressData()
  emit('update:currentStep', props.currentStep ? props.currentStep + 1 : 1)
}

watch(() => props.currentStep, updateAddressData)

const refForm = ref<VForm>()

async function handleSubmit() {
  const { valid } = await refForm.value?.validate()
  if (valid)
    nextStep()
}

function googleAuth() {
  try {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/callback`
  }
  catch (err: any) {
    throw notifier.error('Erro ao tentar autenticar com Google')
  }
}
</script>

<template>
  <VRow>
    <VCol cols="12">
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
              id="first_name"
              v-model="registerIdetificationDataLocal.first_name"
              name="first_name"
              :label="$t('name')"
              :rules="[
                requiredValidator(registerIdetificationDataLocal.first_name, $t('name')),
                min(registerIdetificationDataLocal.first_name, 3, $t('name')),
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
                min(registerIdetificationDataLocal.last_name, 3, $t('surname')),
              ]"
            />
          </VCol>
          <VCol cols="12">
            <AppTextField
              v-model="registerIdetificationDataLocal.cellphone"
              v-mask="['(##) #####-####', '(##) ####-####']"
              :label="$t('cell_phone')"
              :rules="[requiredValidator(registerIdetificationDataLocal.cellphone, $t('cell_phone'))]"
            />
          </VCol>

          <VCol
            cols="12"
            class="d-flex justify-space-between"
          >
            <VBtn
              type="reset"
              variant="outlined"
              :to="{ name: 'login' }"
            >
              {{ $t('back login') }}
            </VBtn>
            <VBtn
              variant="outlined"
              color="secondary"
              @click="googleAuth"
            >
              <img
                :src="svgGoogle"
                alt="icon"
                width="27"
                height="27"
              >
              <span
                class="text-black"
                style="text-transform: capitalize;"
              >Google</span>
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

<style scoped>
.text-black {
  color: rgb(0, 0, 0, 0.67) !important;
  font-size: .875rem;
}
</style>
