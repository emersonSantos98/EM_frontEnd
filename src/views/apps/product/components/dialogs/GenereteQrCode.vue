<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { tableListProductStore } from '@/views/apps/product/components/table/tableListProductStore'

interface Props {
  isDialogVisible: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDialogVisible: false,
})

const store = tableListProductStore()
const generateQrCodeUrl = computed(() => store.generateQrCodeUrl)
const loading = computed(() => store.loading)

const quantity = ref(1) // Quantidade de etiquetas a serem impressas

watch(() => props.isDialogVisible, (newVal) => {
  if (!newVal) {
    quantity.value = 1
    store.generateQrCodeUrl = null
  }
})

const isValidQuantity = computed(() => quantity.value > 0)

async function generateQRCodes() {
  if (isValidQuantity.value) {
    await store.generateQrCode(38, quantity.value) // Passando a quantidade como parâmetro
  } else {
    alert('Por favor, insira uma quantidade válida.')
  }
}

function printQRCode() {
  const iframe = document.querySelector('iframe')
  if (iframe) {
    iframe.contentWindow.print()
  }
}

function downloadQRCode() {
  const link = document.createElement('a')
  link.href = generateQrCodeUrl.value
  link.download = 'qrcode.pdf'
  link.click()
}
</script>

<template>
  <VDialog
    max-width="787"
    :model-value="props.isDialogVisible"
    @update:model-value="val => $emit('update:isDialogVisible', val)"
  >
    <DialogCloseBtn @click="$emit('update:isDialogVisible', false)" />

    <VCard class="pa-3 pa-sm-6">
      <VCardItem class="text-center">
        <VCardTitle class="text-h4 mb-2">
          Gerar QR Code Produto
        </VCardTitle>
        <VCardSubtitle>
          <span class="text-sm">
            Gerar QR Code para variações do produto
          </span>
        </VCardSubtitle>
      </VCardItem>

      <VCardText>
        <div class="my-3">
          <VTextField
            v-model="quantity"
            label="Quantidade de etiquetas"
            type="number"
            min="1"
            dense
            outlined
            hide-details="auto"
            class="quantity-input"
            :error="!isValidQuantity"
            error-messages="Quantidade deve ser maior que zero"
          />
        </div>

        <div class="d-flex gap-2 justify-center mb-3">
          <VBtn @click="generateQRCodes" :disabled="!isValidQuantity">
            Gerar QR Codes
          </VBtn>
          <VBtn
            color="secondary"
            variant="tonal"
            @click="$emit('update:isDialogVisible', false)"
          >
            Fechar
          </VBtn>
          <VBtn
            color="success"
            variant="tonal"
            @click="printQRCode"
            v-if="generateQrCodeUrl"
          >
            Imprimir
          </VBtn>
          <VBtn
            color="info"
            variant="tonal"
            @click="downloadQRCode"
            v-if="generateQrCodeUrl"
          >
            Download
          </VBtn>
        </div>

        <VOverlay v-if="loading">
          <VProgressCircular indeterminate size="64"></VProgressCircular>
        </VOverlay>

        <iframe
          v-if="generateQrCodeUrl"
          :src="generateQrCodeUrl"
          width="100%"
          height="400px"
          class="qr-code-iframe"
        />
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.quantity-input {
  width: 200px;
  margin: 0 auto;
}

.qr-code-iframe {
  border: none;
}

.text-h4 {
  font-size: 1.375rem !important;
}

.text-sm {
  font-size: 0.875rem !important;
}

.d-flex {
  display: flex;
}

.gap-2 {
  gap: 0.5rem;
}

.justify-center {
  justify-content: center;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

.my-3 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>
