<script setup lang="ts">
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'submit', value: string): void
}
interface Props {
  email?: string
  isDialogVisible: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const email = ref(structuredClone(toRaw(props.email)))

const formSubmit = () => {
  if (email.value) {
    emit('submit', email.value)
    emit('update:isDialogVisible', false)
  }
}

const resetEmail = () => {
  email.value = structuredClone(toRaw(props.email))
  emit('update:isDialogVisible', false)
}

const dialogModelValueUpdate = (val: boolean) => {
  emit('update:isDialogVisible', val)
}
</script>

<template>
  <VDialog
    max-width="600"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-5 pa-sm-15">
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 font-weight-medium ">
          Enable One Time Password
        </VCardTitle>
        <VCardSubtitle class="mt-3">
          Verify Your Mobile Number for Email
        </VCardSubtitle>
      </VCardItem>

      <VCardText class="pt-6">
        <p class="mb-6">
          Enter your email with country code and  we will send you a verification code.
        </p>

        <VForm @submit.prevent="() => {}">
          <VTextField
            v-model="email"
            dirty
            name="mobile"
            type="email"
            label="Email"
            placeholder="email@example.com"
            class="mb-5"
          />

          <VBtn
            type="submit"
            class="me-3"
            @click="formSubmit"
          >
            Submit
          </VBtn>
          <VBtn
            color="secondary"
            variant="tonal"
            @click="resetEmail"
          >
            Cancel
          </VBtn>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
