<script lang="ts" setup>
import type { VForm } from "vuetify/components/VForm";
import { requiredValidator } from "@validators";
import { useGenerateTagZebraStore } from "@/views/apps/generateTagZebra/GenerateTagZebraStore";
import { generateTagZebraParams } from "@/views/apps/generateTagZebra/types";
import { PDFDocument } from "pdf-lib"; // Para salvar o arquivo no navegador

// import { ref, onMounted, watchEffect } from "vue";

const files = ref<File[]>([]);
import * as fs from "fs";

const zpl = ref("");
const refForm = ref<VForm>();
const pdfUrl = ref(null); // URL do PDF gerado
const totalLabels = ref(0); // Total de etiquetas geradas

const generateTagZebraStore = useGenerateTagZebraStore();

async function findOne() {
  const { data } = await generateTagZebraStore.findOne();

  zpl.value = data.zpl;
}

async function update() {
  const Paramns: generateTagZebraParams = {
    zpl: zpl.value,
  };

  await generateTagZebraStore.update(Paramns);
  findOne();
}

async function generateTagZebra() {
  if (files.value.length === 0) {
    return;
  }

  try {
    const file = files.value[0];
    const text = await readFileAsText(file);

    const params: generateTagZebraParams = {
      zpl: text,
    };

    console.log("params", params);
    var returnTagZebra = await generateTagZebraStore.generateTagZebra(params);
    console.log("buffersPdf", returnTagZebra.bufferPdf);
    totalLabels.value = returnTagZebra.totalLabels;
    // Concatena os buffers de PDF em um único buffer

    const concatenatedBuffer = await concatPDFBuffers(returnTagZebra.bufferPdf);

    console.log("concatenatedBufferjg", concatenatedBuffer);
    // Cria o Blob e o URL temporário para o PDF concatenado

    const blob = new Blob([concatenatedBuffer], { type: "application/pdf" });

    // Cria um URL temporário para o Blob
    pdfUrl.value = URL.createObjectURL(blob);

    // Agora você pode usar pdfUrl para exibir ou fazer o download do PDF
    console.log("URL do PDF concatenado:", pdfUrl);

    // pdfUrl.value = getBlobUrl(concatenatedBuffer);

    // findOne();
  } catch (e) {
    console.log("e", e);
  }
}
function getBlobUrl(bufferPdf) {
  const blob = new Blob([bufferPdf], { type: "application/pdf" });
  return URL.createObjectURL(blob);
}
// async function concatPDFBuffersbosta(buffers) {
//   // return new Promise(async (resolve, reject) => {
//   try {
//     const uint8Arrays = buffers.map((bufferObj) => {
//       if (bufferObj && bufferObj.data && Array.isArray(bufferObj.data)) {
//         return new Uint8Array(bufferObj.data);
//       } else {
//         throw new Error("Dados do buffer inválidos.");
//       }
//     });

//     const pdfDoc = await PDFDocument.create();

//     for (const uint8Array of uint8Arrays) {
//       const externalDoc = await PDFDocument.load(uint8Array);
//       const externalPages = await pdfDoc.copyPages(
//         externalDoc,
//         externalDoc.getPageIndices()
//       );
//       externalPages.forEach((page) => pdfDoc.addPage(page));
//     }

//     const pdfBytes = await pdfDoc.save();
//     console.log("pdfBytes", pdfBytes);
//     const outputFilePath = "C:/Users/Uélinton/Downloads/PDF/concatenated.pdf";
//     fs.writeFile(outputFilePath, pdfBytes);

//     return pdfBytes;
//     // resolve(pdfBytes);
//   } catch (error) {
//     // reject(error);
//   }
//   // });
// }
async function concatPDFBuffers(buffers) {
  if (buffers.length === 0) {
    console.error("Nenhum buffer de PDF recebido do backend.");
    return;
  }
  try {
    const pdfDoc = await PDFDocument.create();

    for (const buffer of buffers) {
      // Certifique-se de que `buffer` seja do tipo `Uint8Array`
      const uint8Array = new Uint8Array(buffer.data);
      const doc = await PDFDocument.load(uint8Array);
      const copiedPages = await pdfDoc.copyPages(doc, doc.getPageIndices());
      copiedPages.forEach((page) => pdfDoc.addPage(page));
    }

    const pdfBytes = await pdfDoc.save();
    // Criar um Blob com os bytes do PDF
    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    return pdfBytes;
  } catch (error) {
    console.error("Erro ao concatenar PDFs:", error);
    throw error;
  }

  console.log("buffers contar", buffers.length);

  // Converter cada objeto { type: "Buffer", data: [...] } para Uint8Array
  const uint8Arrays = buffers.map((bufferObj) => {
    const bufferArray = bufferObj.data || [];
    return new Uint8Array(bufferArray);
  });

  // Calcular o tamanho total do buffer concatenado
  let totalLength = 0;

  uint8Arrays.forEach((uint8Array) => {
    totalLength += uint8Array.length;
  });
  console.log("totalLength", totalLength);
  // Criar um novo ArrayBuffer para armazenar o buffer concatenado
  const concatenatedBuffer = new Uint8Array(totalLength);
  let offset = 0;

  // Copiar cada Uint8Array para o ArrayBuffer concatenado
  uint8Arrays.forEach((uint8Array) => {
    concatenatedBuffer.set(uint8Array, offset);
    offset += uint8Array.length;
  });

  return concatenatedBuffer;
}

async function readFileAsText(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

async function downloadPdf() {
  if (!pdfUrl.value) {
    return;
  }

  const a = document.createElement("a");
  a.href = pdfUrl.value;
  a.download = "etiquetas.pdf";
  a.click();
}

onMounted(() => {
  // findOne()
});

watchEffect(() => {
  //   findOne();
});
</script>

<template>
  <div>
    <VCard class="mb-6">
      <template v-slot:title>
        <div class="d-flex align-center">
          <span class="ms-2 text-primary">Gerador de Etiquetas Shopee </span>
          <v-icon color="primary">tabler-brand-shopee</v-icon>
        </div>
      </template>
      <VCardText>
        <div class="d-flex align-center">
          <div class="flex-grow-1">
            <VFileInput
              v-model="files"
              multiple
              placeholder="Upload your documents"
              label="Importe o ZPL"
              prepend-icon="tabler-paperclip"
            >
              <template #selection="{ fileNames }">
                <template v-for="fileName in fileNames" :key="fileName">
                  <VChip label color="primary" class="me-2">
                    {{ fileName }}
                  </VChip>
                </template>
              </template>
            </VFileInput>
          </div>
          <div class="ms-4">
            <VBtn
              cols="12"
              @click="generateTagZebra"
              color="primary"
              append-icon="tabler-upload"
              :disabled="files.length === 0"
            >
              Gerar Etiquetas
            </VBtn>
          </div>
        </div>
      </VCardText>
    </VCard>

    <VCard title="" class="mb-6">
      <VCardText>
        <div v-if="pdfUrl">
          <h2 class="text-primary">Etiquetas:</h2>
          <!-- <a :href="pdfUrl" target="_blank">Visualizar/Imprimir Etiquetas</a> -->
        </div>
      </VCardText>
      <VCardText>
        <div v-if="pdfUrl">
          <div class="mb-2">
            <VAlert variant="outlined" color="warning">
              <div class="d-flex justify-space-between align-center">
                <a :href="pdfUrl" target="_blank">Visualizar/Imprimir</a>
                <VBtn
                  append-icon="tabler-download"
                  @click="downloadPdf"
                  outlined
                >
                  Donwload
                </VBtn>
              </div>
            </VAlert>
          </div>
          <div class="d-flex align-center">
            <div>
              <h3 class="text-primary">Total Processadas:</h3>
            </div>
            <div class="ms-2">
              <h3 class="text-primary">{{ totalLabels }}</h3>
            </div>
          </div>
        </div>

        <!-- <VProgressLinear v-model="knowledge" height="20" color="primary">
          <strong>{{ Math.ceil(knowledge) }}%</strong>
        </VProgressLinear> -->
      </VCardText>
    </VCard>
  </div>
</template>

<route lang="yaml">
meta:
  action: read
  subject: Auth
  auth: true
</route>
