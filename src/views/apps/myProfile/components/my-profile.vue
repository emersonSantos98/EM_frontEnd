<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { VForm } from 'vuetify/components/VForm'
import { requiredValidator } from '@validators'
import { useProfileStore } from '@/views/apps/myProfile/ProfileStore'
import type { ProfileParams } from '@/views/apps/myProfile/types'

const name = ref('')
const email = ref('')
const document = ref('')
const cellphone = ref('')
const refForm = ref<VForm>()

const profileStore = useProfileStore()

async function findOne() {
  const { data } = await profileStore.findOne()

  name.value = data.name
  email.value = data.email
  cellphone.value = data.cellphone
  document.value = data.document
}

async function update() {
  const Paramns: ProfileParams = {
    name: name.value,
    email: email.value,
    cellphone: cellphone.value,
    document: document.value,
  }

  await profileStore.update(Paramns)
  findOne()
}

onMounted(() => {
  // findOne()
})

watchEffect(() => {
  findOne()
})
</script>

<template>
  <VRow>
    <VCol
      cols="12"
    >
      <VCard
        :title="$t('My Profile')"
        :loading="profileStore.loading"
      >
        <VForm
          ref="refForm"
          @submit.prevent="() => {}"
        >
          <VCardText
            class="pt-0"
          >
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="name"
                  placeholder="Nome Completo"
                  persistent-placeholder
                  :rules="[requiredValidator]"
                  prepend-inner-icon="tabler-user"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="cellphone"
                  v-mask="'(##) #####-####'"
                  placeholder="Telefone"
                  persistent-placeholder
                  :rules="[requiredValidator]"
                  prepend-inner-icon="tabler-device-mobile"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="email"
                  placeholder="Email"
                  persistent-placeholder
                  :rules="[requiredValidator, emailValidator]"
                  disabled="true"
                  prepend-inner-icon="tabler-mail"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="document"
                  v-mask="'###.###.###-##', '##.###.###/####-##'"
                  placeholder="Documento"
                  persistent-placeholder
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12">
                <VBtn
                  type="Submit"
                  :loading="profileStore.loading"
                  :disabled="name === '' || email === '' || cellphone === '' || document === ''"
                  @click="refForm?.validate() && update()"
                >
                  {{ $t('Save') }}
                </VBtn>
              </VCol>
            </VRow>
          </VCardText>
        </VForm>
      </VCard>
    </VCol>
  </VRow>
</template>

<style scoped lang="scss">

</style>
<route lang="yaml">
meta:
action: read
subject: Auth
auth: true
</route>
