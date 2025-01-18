<script setup lang="ts">
import { ref, watch } from 'vue'
import type { IQueryVariation, ProductType } from '@/views/apps/workshop/product/types'

// Props recebidas do componente pai
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

// Emissor de eventos para atualizar os dados no componente pai
const emit = defineEmits(['update:variations', 'update:product'])

// Local state para gerenciamento interno
const selectedImage = ref<string | null>(null)

// Observa alterações no produto para resetar a imagem
watch(
  () => props.product.imagem,
  newImage => {
    if (!newImage)
      selectedImage.value = null
  },
)

// Upload de imagem com pré-visualização
function handleImageUpload(event: Event) {
  const fileInput = event.target as HTMLInputElement
  if (fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0]

    props.product.imagem = file

    // Gera a pré-visualização da imagem
    const reader = new FileReader()

    reader.onload = () => {
      selectedImage.value = reader.result as string
    }
    reader.readAsDataURL(file)
    emit('update:product', { ...props.product }) // Emite a alteração para o pai
  }
}

// Adiciona uma nova variação
function addVariation() {
  const newVariation: IQueryVariation = {
    id: `${Date.now()}`, // Gera um ID único
    tamanho: '',
    estampa: '',
    estoque: 0,
    sku: '',
  }

  props.variations.push(newVariation)
  emit('update:variations', [...props.variations])
}

// Remove uma variação
function removeVariation(index: number) {
  props.variations.splice(index, 1)
  emit('update:variations', [...props.variations])
}
</script>

<template>
  <div>
    <VRow>
      <VCol md="12">
        <!-- Informações do Produto -->
        <VCard class="mb-6">
          <VCardTitle>Informações do Produto</VCardTitle>
          <VCardText>
            <VRow>
              <!-- Nome do Produto -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="props.product.nome"
                  label="Nome do Produto"
                  placeholder="Ex.: Camisa Vermelha"
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
                  placeholder="Ex.: CAMVER001"
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
                  placeholder="Digite a cor do produto"
                  outlined
                  @input="emit('update:product', { ...props.product })"
                />
              </VCol>

              <!-- Descrição -->
              <VCol cols="12">
                <VTextarea
                  v-model="props.product.descricao"
                  label="Descrição do Produto"
                  placeholder="Digite uma descrição detalhada..."
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
                <!-- Pré-visualização da Imagem -->
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

        <!-- Variações -->
        <VCard class="mb-6">
          <VCardTitle>Variações</VCardTitle>
          <VCardText>
            <VRow
              v-for="(variation, index) in props.variations"
              :key="variation.id"
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
                  placeholder="Selecione o Tamanho"
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
                  placeholder="Selecione a Estampa"
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
                  placeholder="Quantidade"
                  outlined
                />
              </VCol>

              <!-- SKU -->
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="variation.sku"
                  label="SKU da Variação"
                  placeholder="Ex.: CAMVER001-M"
                  outlined
                />
              </VCol>

              <!-- Remover Variação -->
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

            <!-- Adicionar Nova Variação -->
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
