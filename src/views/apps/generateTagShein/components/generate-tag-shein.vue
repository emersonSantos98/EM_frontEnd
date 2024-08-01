<script setup lang="ts">
import { useDropZone, useFileDialog, useObjectUrl } from "@vueuse/core";
import { ref, computed } from "vue";
import { useGenerateTagSheinStore } from "@/views/apps/generateTagShein/GenerateTagSheinStore";
import { PDFDocument } from "pdf-lib";

const store = useGenerateTagSheinStore();
const dropZoneRef = ref<HTMLDivElement>();
const generatedLabelUrl = computed(() => store.generatedLabelUrl);

interface FileData {
  file: File;
  url: string;
}

const fileData = ref<FileData[]>([]);
const { open, onChange } = useFileDialog({ accept: "application/pdf" });

function onDrop(DroppedFiles: File[] | null) {
  if (DroppedFiles) {
    const file = DroppedFiles[0];
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed");

      return;
    }
    fileData.value = [
      {
        file,
        url: useObjectUrl(file).value ?? "",
      },
    ];
  }
}

onChange((selectedFiles) => {
  if (selectedFiles) {
    const file = selectedFiles[0];
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed");

      return;
    }
    handleFile(file);
  }
});

async function handleFile(file: File) {
  fileData.value = [
    {
      file,
      url: useObjectUrl(file).value ?? "",
    },
  ];

  // Chamar a função para contar páginas do PDF
  const countPage = await store.countPages(file);

  store.countPages = countPage;
}

useDropZone(dropZoneRef, onDrop);

async function generateShippingLabel() {
  if (fileData.value.length === 0) {
    alert("Please upload a PDF file");

    return;
  }

  const formData = new FormData();
  formData.append("file", fileData.value[0].file);

  await store.generateTagShein(formData);
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard class="mb-6">
        <VCardTitle> Gerar Etiqueta de Envio </VCardTitle>
        <VCardText>
          <VCol cols="12" md="12">
            <VAlert
              type="warning"
              variant="tonal"
              dismissible
              v-if="store.countPages > 1"
            >
              <!-- v-model="store.alert.show" -->
              <!-- {{ store.alert.message }} -->

              Total de Etiquetas e Danfe importadas:
              <span v-if="store.countPages > 1">
                {{ store.countPages + " " }} Páginas</span
              >
            </VAlert>
          </VCol>
          <VCol cols="12" md="12">
            <VAlert
              type="success"
              variant="tonal"
              dismissible
              v-if="store.countpagesEconomic > 1"
            >
              <!-- v-model="store.alert.show" -->
              <!-- {{ store.alert.message }} -->
              <div class="economia-container">
                <span> Etiquetas e DANFE geradas com economia: agora com </span>

                <span v-if="store.countpagesEconomic > 1" class="ml-2">
                  {{ " " + store.countpagesEconomic + " " }} páginas</span
                >
                <span class="separator"></span>
                <!-- Adiciona um espaço separador -->

                <span class="economized-text">
                  <strong>Você economizou</strong>
                  {{ store.countPages - store.countpagesEconomic }} Etiquetas
                </span>
              </div>
            </VAlert>
          </VCol>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="6">
      <VCard class="mb-6">
        <VCardTitle> Upload Etiqueta de envio </VCardTitle>
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
                  <VIcon icon="tabler-upload" size="50" class="text-primary" />
                  <div class="text-base text-high-emphasis font-weight-medium">
                    Arraste e solte o arquivo aqui
                  </div>
                  <span class="text-disabled">ou</span>
                  <VBtn variant="tonal"> Selecione o arquivo PDF </VBtn>
                </div>

                <div
                  v-else
                  class="d-flex justify-center align-center gap-3 pa-8 border-dashed drop-zone flex-wrap"
                >
                  <VRow class="match-height w-100">
                    <template v-for="(item, index) in fileData" :key="index">
                      <VCol cols="12" sm="12">
                        <VCard :ripple="false" border>
                          <VCardText class="d-flex flex-column" @click.stop>
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
                              @click.stop="fileData.splice(index, 1)"
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
    <VCol cols="12" md="6">
      <VCard v-if="generatedLabelUrl" class="mb-6">
        <VCardTitle> Etiqueta de Envio Gerada </VCardTitle>

        <VCardText>
          <div class="flex justify-center">
            <iframe
              :src="generatedLabelUrl"
              width="100%"
              height="600px"
            ></iframe>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.economia-container {
  display: flex;
  align-items: center; /* Centraliza verticalmente */
}
.separator {
  flex: 1; /* Faz o espaço separador ocupar o espaço restante */
}
.economized-text {
  font-weight: bold; /* Define o texto "Você economizou" em negrito */
}
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

<style lang="scss">
.inventory-card {
  .v-radio-group,
  .v-checkbox {
    .v-selection-control {
      align-items: start !important;

      .v-selection-control__wrapper {
        margin-block-start: -0.375rem !important;
      }
    }

    .v-label.custom-input {
      border: none !important;
    }
  }

  .v-tabs.v-tabs-pill {
    .v-slide-group-item--active.v-tab--selected.text-primary {
      h6 {
        color: #fff !important;
      }
    }
  }
}

.ProseMirror {
  p {
    margin-block-end: 0;
  }

  padding: 0.5rem;
  outline: none;

  p.is-editor-empty:first-child::before {
    block-size: 0;
    color: #adb5bd;
    content: attr(data-placeholder);
    float: inline-start;
    pointer-events: none;
  }
}
</style>

<route lang="yaml">
meta:
  action: read
  subject: Auth
  auth: true
</route>
