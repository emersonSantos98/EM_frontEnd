<script setup lang="ts">
import { useDropZone, useFileDialog, useObjectUrl } from '@vueuse/core'
import { ref, watch } from 'vue'
import { useLabelOrganizerStore } from '@/views/apps/shipping-labels/labelOrganizerStore'
import Viewfille from '@/views/apps/shipping-labels/viewfille.vue'
import Notifier from '@core/utils/Notifier'

const notifier = new Notifier()
const store = useLabelOrganizerStore()
const dropZoneRef = ref<HTMLDivElement>()

interface FileData {
  file: File
  url: string
}

const fileData = ref<FileData[]>([])
const { open, onChange } = useFileDialog({ accept: 'application/pdf' })

function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural
}

async function processFile(file: File) {
  const countPage = await store.countPages(file)

  store.countPages = countPage
}

function onDrop(DroppedFiles: File[] | null) {
  if (DroppedFiles) {
    const file = DroppedFiles[0]
    if (file.type !== 'application/pdf') {
      notifier.error('Somente arquivos PDF são permitidos')

      return
    }
    fileData.value = [{
      file,
      url: useObjectUrl(file).value ?? '',
    }]
    processFile(file)
  }
}

onChange(async selectedFiles => {
  if (selectedFiles) {
    const file = selectedFiles[0]
    if (file.type !== 'application/pdf') {
      notifier.error('Somente arquivos PDF são permitidos')

      return
    }
    fileData.value = [{
      file,
      url: useObjectUrl(file).value ?? '',
    }]
    processFile(file)
  }
})

useDropZone(dropZoneRef, onDrop)

function removeFile(index: number) {
  fileData.value.splice(index, 1)
  store.countPages = 0
  store.countpagesEconomic = 0
  store.generatedLabelUrl = null
}

async function generateShippingLabel() {
  if (fileData.value.length === 0) {
    notifier.error('Nenhum arquivo selecionado')

    return
  }

  const formData = new FormData()

  formData.append('file', fileData.value[0].file)
  await store.generateShippingLabels(formData)
}

watch(fileData, newFileData => {
  if (newFileData.length === 0) {
    store.countPages = 0
    store.countpagesEconomic = 0
    store.generatedLabelUrl = null
  }
})

function printPDF() {
  window.open(store.generatedLabelUrl, '_blank')
}
</script>

<template>
  <VRow class="align-center justify-center">
    <VCol cols="12" :md="store.generatedLabelUrl ? 5 : 12">
      <VCard class="mb-6">
        <VCardTitle>
          Upload de Etiqueta de Envio
        </VCardTitle>
        <VCardText>
          <VCol cols="12" md="12">
            <VAlert
              v-if="store.countPages > 0"
              type="warning"
              variant="tonal"
              dismissible
            >
              Total de
              {{ pluralize(store.countPages, 'Etiqueta e declaração de conteúdo importada:', 'Etiquetas e declarações de conteúdo importadas:') }}
              <span>{{ store.countPages }} {{ pluralize(store.countPages, 'página', 'páginas') }}</span>
            </VAlert>
          </VCol>
          <VCol cols="12" md="12">
            <VAlert
              v-if="store.countpagesEconomic > 0"
              type="success"
              variant="tonal"
              dismissible
            >
              <div class="economia-container">
                <div>
                  {{ pluralize(store.countpagesEconomic, 'Etiqueta e declaração de conteúdo otimizada:', 'Etiquetas e declarações de conteúdo otimizadas:') }}
                  <strong>{{ store.countpagesEconomic }}</strong>
                  {{ pluralize(store.countpagesEconomic, 'página', 'páginas') }}
                </div>
                <div>
                  Você economizou:
                  <strong>{{ store.countPages - store.countpagesEconomic }}</strong>
                  {{ pluralize(store.countPages - store.countpagesEconomic, 'página', 'páginas') }}
                </div>
              </div>
            </VAlert>
          </VCol>
        </VCardText>
        <VCardText>
          <div class="flex">
            <div class="w-full h-auto relative">
              <div
                ref="dropZoneRef"
                class="cursor-pointer"
                @click="() => open()"
              >
                <div
                  v-if="fileData.length === 0"
                  class="d-flex flex-column justify-center align-center gap-y-3 px-6 py-10 border-dashed drop-zone"
                >
                  <VIcon
                    icon="tabler-upload"
                    size="50"
                    class="text-primary"
                  />
                  <div class="text-base text-high-emphasis font-weight-medium">
                    Arraste e solte o arquivo aqui
                  </div>
                  <span class="text-disabled">ou</span>
                  <VBtn variant="tonal">
                    Selecione o arquivo PDF
                  </VBtn>
                </div>

                <div
                  v-else
                  class="d-flex justify-center align-center gap-3 pa-8 border-dashed drop-zone flex-wrap"
                >
                  <VRow class="match-height w-100">
                    <template v-for="(item, index) in fileData" :key="index">
                      <VCol cols="12" sm="12">
                        <VCard :ripple="false" border>
                          <VCardText
                            class="d-flex flex-column"
                            @click.stop
                          >
                            <VIcon
                              start
                              icon="tabler-file-type-pdf"
                              class="w-100 mx-auto"
                              size="50"
                              color="primary"
                            />
                            <div class="mt-2 w-100 mx-auto text-center">
                              <span class="clamp-text text-wrap">
                                {{ item.file.name }}
                              </span>
                              <span>
                                {{ (item.file.size / 1024).toFixed(2) }} KB
                              </span>
                            </div>
                          </VCardText>
                          <VSpacer />
                          <VCardActions>
                            <VBtn
                              variant="outlined"
                              block
                              @click.stop="removeFile(index)"
                            >
                              Remover Arquivo
                            </VBtn>
                          </VCardActions>
                        </VCard>
                      </VCol>
                    </template>
                  </VRow>
                </div>
              </div>
            </div>
          </div>
          <VBtn
            class="mt-4"
            variant="tonal"
            :loading="store.loading"
            @click="generateShippingLabel"
          >
            Enviar Etiqueta
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="2" class="d-flex flex-column justify-center align-center" v-if="store.generatedLabelUrl" >
      <VBtn
        class="mb-4"
        color="success"
        @click="printPDF"
      >
        Imprimir
        <VIcon
          end
          icon="tabler-printer"
        />
      </VBtn>
      <lord-icon
        src="https://cdn.lordicon.com/axacjdbs.json"
        trigger="hover"
        colors="primary:#65d2d7,secondary:#f69666"
        style="width:100px;height:100px">
      </lord-icon>
    </VCol>

    <VCol cols="12" md="5">
      <Viewfille />
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.drop-zone {
  border: 2px dashed rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 6px;
}
.drop-zone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}
</style>


<route lang="yaml">
meta:
  action: read
  subject: Auth
</route>
