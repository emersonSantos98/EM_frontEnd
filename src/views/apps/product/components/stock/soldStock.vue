<script setup lang="ts">
import { ref } from 'vue'
import { VAvatar, VIcon } from 'vuetify/components'
import { QrcodeStream } from 'vue-qrcode-reader'

// Referências reativas para armazenar os valores
const decodedContent = ref('')
const showScanner = ref(false)
const id = ref('')
const nome = ref('')
const cor = ref('')
const tamanho = ref('')
const ean = ref('')

// Função para processar o conteúdo detectado do QR code
function onDetect(detectedCodes) {
  if (detectedCodes && detectedCodes.length > 0) {
    const content = detectedCodes[0].rawValue
    console.log('QR code detected:', content)
    decodedContent.value = content

    // Dividir a string do QR code em partes
    const parts = content.split(' - ')

    console.log('QR code parts:', parts)

    // Processar as partes do QR code
    if (parts.length === 4) {
      const idAndName = parts[0].split('-')
      if (idAndName.length >= 2) {
        id.value = idAndName[1] // Presumindo que a segunda parte é o ID
        nome.value = idAndName.slice(2).join('-') // Juntando o restante como nome
      } else {
        alert('Formato do QR code inválido')
      }
      cor.value = parts[1]
      tamanho.value = parts[2]
      ean.value = parts[3]
    } else {
      alert('Formato do QR code inválido')
    }

    showScanner.value = false
  }
}

// Função para lidar com a inicialização do leitor de QR code
function onInit(promise: Promise<void>) {
  promise.catch(error => {
    if (error.name === 'NotAllowedError') {
      alert('Permission denied!')
    } else if (error.name === 'NotFoundError') {
      alert('No camera found!')
    } else {
      alert(`Error initializing QR code reader: ${error.message}`)
    }
    console.error('QR code reader initialization error:', error)
  })
}

// Função para lidar com erros do leitor de QR code
function onError(error: Error) {
  console.error('QR code reader error:', error)
}
</script>

<template>
  <div
    style="border-color: rgb(var(--v-theme-primary)) !important; width: 100%; height: 100%;"
    class="d-flex flex-column justify-center align-center cursor-pointer rounded px-5 py-2 me-6 border border-dashed"
    @click="showScanner = true"
  >
    <VAvatar
      rounded
      size="38"
      color="primary"
      variant="tonal"
      class="mb-2"
    >
      <VIcon icon="tabler-qrcode" />
    </VAvatar>
    <p class="mb-0">
      Dar Baixa no Estoque
    </p>
  </div>

  <div
    v-if="showScanner"
    class="scanner-container"
  >
    <QrcodeStream
      @detect="onDetect"
      @init="onInit"
      @error="onError"
    />
  </div>

  <div v-if="decodedContent">
    <p>ID: {{ id }}</p>
    <p>Nome: {{ nome }}</p>
    <p>Cor: {{ cor }}</p>
    <p>Tamanho: {{ tamanho }}</p>
    <p>EAN: {{ ean }}</p>
  </div>
</template>

<style scoped lang="scss">
.scanner-container {
  width: 100%;
  height: 100%;
  max-width: 600px;
  max-height: 400px;
  margin: auto;
}
</style>

<route lang="yaml">
meta:
  action: read
  subject: Auth
</route>
