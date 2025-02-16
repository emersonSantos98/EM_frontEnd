<script setup lang="ts">
import { ref, watch } from 'vue'
import type { IQueryVariation, ProductType } from '@/views/apps/workshop/product/types'

// Props recebidas do componente pai (product e variations)
const props = defineProps({
  product: {
    type: Object as () => ProductType,
    required: true,
  },
  variations: {
    type: Array as () => IQueryVariation[],
    required: true,
  },
})

// Emite eventos para atualizar o pai (v-model)
const emit = defineEmits(['update:product', 'update:variations'])

// Preview da imagem (string base64 ou URL)
const selectedImage = ref<string | null>(props.product.imagem ?? null)

/**
 * Observa "props.product.imagem".
 * Se for nulo, reseta preview;
 * Se for File, faz FileReader;
 * Se for string, assume que é URL/caminho vindo do backend.
 */
watch(
  () => props.product.imagem,
  newImage => {
    if (!newImage) {
      selectedImage.value = null
    }
    else if (newImage instanceof File) {
      const reader = new FileReader()

      reader.onload = () => {
        selectedImage.value = reader.result as string
      }
      reader.readAsDataURL(newImage)
    }
    else if (typeof newImage === 'string') {
      selectedImage.value = newImage
    }
  },
  { immediate: true },
)

// Upload de imagem com pré-visualização
function handleImageUpload(event: Event) {
  const fileInput = event.target as HTMLInputElement
  if (fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0]

    props.product.imagem = file

    const reader = new FileReader()

    reader.onload = () => {
      selectedImage.value = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  // Only emit update if there's a new file
  emit('update:product', {
    ...props.product,

    // Only include image in payload if it was changed
    imagem: fileInput.files?.[0] || props.product.imagem,
  })
}

// Adiciona uma nova variação ao produto
function addVariation() {
  const newVariation: IQueryVariation = {
    tamanho: '',
    estampa: '',
    estoque: 0,
    sku: '',
  }

  props.variations.push(newVariation)
  emit('update:variations', [...props.variations])
}

// Remove uma variação pelo índice
function removeVariation(index: number) {
  props.variations.splice(index, 1)
  emit('update:variations', [...props.variations])
}
</script>

<template>
  <div>
    <VRow>
      <VCol md="12">
        <!-- Card com informações do Produto -->
        <VCard class="mb-6">
          <VCardTitle>Informações do Produto</VCardTitle>
          <VCardText>
            <VRow>
              <!-- Nome -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="props.product.nome"
                  label="Nome do Produto"
                  outlined
                  @input="emit('update:product', { ...props.product })"
                />
              </VCol>

              <!-- SKU -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="props.product.sku"
                  label="SKU"
                  outlined
                  @input="emit('update:product', { ...props.product })"
                />
              </VCol>

              <!-- Cor -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="props.product.cor"
                  label="Cor"
                  outlined
                  @input="emit('update:product', { ...props.product })"
                />
              </VCol>

              <!-- Descrição -->
              <VCol cols="12">
                <VTextarea
                  v-model="props.product.descricao"
                  label="Descrição do Produto"
                  rows="4"
                  outlined
                  @input="emit('update:product', { ...props.product })"
                />
              </VCol>

              <!-- Upload de Imagem -->
              <VCol
                cols="12"
                md="6"
              >
                <label
                  for="productImage"
                  class="mb-2 d-block"
                >Imagem do Produto</label>
                <VFileInput
                  id="productImage"
                  label="Selecione uma imagem"
                  accept="image/*"
                  outlined
                  @change="handleImageUpload"
                />
                <div
                  v-if="selectedImage"
                  class="mt-4 text-center"
                >
                  <img
                    :src="selectedImage"
                    alt="Pré-visualização"
                    class="preview-image"
                  >
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <!-- Card com variações -->
        <VCard class="mb-6">
          <VCardTitle>Variações</VCardTitle>
          <VCardText>
            <VRow
              v-for="(variation, index) in props.variations"
              :key="index"
              class="align-center mb-3"
            >
              <!-- Tamanho -->
              <VCol
                cols="12"
                md="3"
              >
                <VAutocomplete
                  v-model="variation.tamanho"
                  label="Tamanho"
                  :items="['P', 'M', 'G', 'GG']"
                  outlined
                />
              </VCol>

              <!-- Estampa -->
              <VCol
                cols="12"
                md="3"
              >
                <VAutocomplete
                  v-model="variation.estampa"
                  label="Estampa"
                  :items="['Lisa', 'Listrado', 'Floral', 'Xadrez']"
                  outlined
                />
              </VCol>

              <!-- Estoque -->
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="variation.estoque"
                  label="Estoque"
                  type="number"
                  outlined
                />
              </VCol>

              <!-- SKU da variação -->
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="variation.sku"
                  label="SKU da Variação"
                  outlined
                />
              </VCol>

              <!-- Remover -->
              <VCol
                cols="12"
                class="d-flex justify-end"
              >
                <VBtn
                  icon
                  color="error"
                  @click="removeVariation(index)"
                >
                  <VIcon>mdi-delete</VIcon>
                </VBtn>
              </VCol>
            </VRow>

            <!-- Botão para adicionar variação -->
            <VBtn
              color="primary"
              class="mt-4"
              @click="addVariation"
            >
              Adicionar Variação
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style scoped>
.preview-image {
  max-width: 100%;
  max-height: 200px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
