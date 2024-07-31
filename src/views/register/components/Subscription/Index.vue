<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import type {IFormSubscriptionDTO} from '@/modules/account/list/register/models/types'

interface Props {
  currentStep?: number
  registerData: IFormSubscriptionDTO
}
interface Emit {
  (e: 'update:currentStep', value: number): void
  (e: 'update:register-data', value: IFormSubscriptionDTO): void
}
const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const registerSubscriptDataLocal = ref(props.registerData)


const resolveDeliveryBadgeData: any = {
  free: { color: 'success', price: 'Free' },
  express: { color: 'secondary', price: 10 },
  overnight: { color: 'secondary', price: 15 },
}

const updateAddressData = () => {
  emit('update:register-data', registerSubscriptDataLocal.value)
}

const backStep = () => {
  updateAddressData()
  emit('update:currentStep', props.currentStep ? props.currentStep - 1 : 1)
}


watch(() => props.currentStep, updateAddressData)
</script>

<template>
      <div class="text-center">
        <VCardText>
          <VAvatar
            color="primary"
            variant="tonal"
            size="50"
            class="mb-4"
          >
            <VIcon
              size="2rem"
              icon="tabler-check"
            />
          </VAvatar>

          <h6 class="text-h6">
            {{ $t('congratulations') }}
          </h6>
        </VCardText>

        <VCardText>
          <p>
            {{ $t('congratulations_description') }}
          </p>
        </VCardText>

        <VCardText class="justify-center">
          <VBtn variant="elevated" :to="{ name: 'login' }">
            {{ $t('go_to_login') }}
          </VBtn>
        </VCardText>
      </div>
</template>
