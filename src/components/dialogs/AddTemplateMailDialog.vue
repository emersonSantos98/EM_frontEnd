<script setup lang="ts">
import Notifier from '@core/utils/Notifier'

const props = withDefaults(defineProps<Props>(), {
  templateMailData: () => ({
    id: 0,
    type: ' ',
    from: ' ',
    subject: ' ',
    urlBucket: ' ',
    status: ' ',
  }),
})

const emit = defineEmits<Emit>()
const notifier = new Notifier()
interface TemplateMailData {
  id: number | null
  type: string
  from: string
  subject: string
  urlBucket: string
  status: string

}

interface Props {
  templateMailData?: TemplateMailData
  isDialogVisible: boolean
}

interface Emit {
  (e: 'submit', value: TemplateMailData): void
  (e: 'update:isDialogVisible', val: boolean): void
}

const templateMailData = ref<TemplateMailData>(structuredClone(toRaw(props.templateMailData)))
const isUseAsBillingAddress = ref(false)

watch(props, () => {
  templateMailData.value = structuredClone(toRaw(props.templateMailData))
})

function copyLink() {
  // Selecionar o campo de texto
  const textField = document.querySelector('.refer-link-input input')

  // Selecionar o texto dentro do campo
  textField.select()

  // Copiar o texto para a área de transferência
  document.execCommand('copy')

  // Deselecionar o campo de texto
  window.getSelection().removeAllRanges()

  // Alerta de que o link foi copiado
  notifier.info('Link copiado para a área de transferência!')
}

function onFormSubmit() {
  emit('update:isDialogVisible', false)
  emit('submit', templateMailData.value)
}

function onFormReset() {
  templateMailData.value = structuredClone(toRaw(props.templateMailData))

  emit('update:isDialogVisible', false)
}

function dialogModelValueUpdate(val: boolean) {
  emit('update:isDialogVisible', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-5 pa-sm-10">
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 mb-3">
          {{ $t('Create Template Mail') }}
        </VCardTitle>
        <p class="mb-0">
          {{ $t('Configure the template you want to send to your customers.') }}
        </p>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm
          class="mt-6"
          @submit.prevent="onFormSubmit"
        >
          <VRow>
            <!-- 👉 Type -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="templateMailData.type"
                :label="$t('Type')"
              />
            </VCol>

            <!-- 👉 From -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="templateMailData.from"
                :label="$t('From')"
                placeholder="suporte@rapidfunnels.com.br"
                prepend-inner-icon="tabler-mail"
              />
            </VCol>

            <!-- 👉 Subject -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="templateMailData.subject"
                :label="$t('Subject')"
              />
            </VCol>

            <!-- 👉 Status -->
            <VCol
              cols="12"
              md="6"
            >
              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 Switch -->

                <VSwitch
                  v-model="templateMailData.status"
                  density="compact"
                  :label="$t('Active')"
                />
              </VCol>
            </VCol>

            <!-- 👉 Url Bucket -->
            <VCol
              md="12"
              cols="12"
            >
              <AppTextField
                v-model="templateMailData.urlBucket"
                density="compact"
                placeholder="https://rapidfunnels-pwa.s3.sa-east-1.amazonaws.com/teste-email/reset-password.html"
                class="refer-link-input me-1"
              >
                <template #append-inner>
                  <VBtn
                    variant="text"
                    @click="copyLink"
                  >
                    {{ $t('Copy link') }}
                  </VBtn>
                </template>
              </AppTextField>
            </VCol>

            <!-- 👉 Submit and Cancel -->
            <VCol
              cols="12"
              class="d-flex flex-wrap justify-center gap-4"
            >
              <VBtn type="submit">
                Submit
              </VBtn>

              <VBtn
                color="secondary"
                variant="tonal"
                @click="onFormReset"
              >
                Cancel
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
