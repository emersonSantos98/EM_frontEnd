<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue'
import type { IQueryVariation, ProductType } from '@/views/apps/workshop/product/types'

// Props recebidas
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

// Emissor de eventos
const emit = defineEmits(['update:variations'])

// Estado local das variações (usado para adicionar/remover variações)
const localVariations = ref([
  { id: 1, type: '', options: [''] },
])

// Sugestões de valores para diferentes tipos de variações
const suggestionMap = {
  Cor: [
    'Preto',
    'Azul',
    'Branco',
    'Vermelho',
    'Verde',
    'Laranja Queimado',
    'Verde Militar',
    'Marsala',
    'Amarelo',
    'Roxo',
    'Cinza',
    'Marrom',
    'Rosa Claro',
    'Turquesa',
    'Vinho',
    'Lavanda',
    'Bege',
    'Oliva',
    'Dourado',
    'Prata',
  ],
  Tamanho: ['P', 'M', 'G', 'GG', '34', '36', '38', '40'],
  Estampa: ['Listrado', 'Floral', 'Xadrez', 'Lisa'],
}

// Função para montar as variações no formato correto
function updateParentVariations() {
  const formattedVariations: IQueryVariation[] = []

  localVariations.value.forEach(variation => {
    if (variation.type === 'Cor' || variation.type === 'Estampa') {
      variation.options.forEach(option => {
        if (variation.type === 'Cor') {
          if (localVariations.value.some(v => v.type === 'Tamanho')) {
            localVariations.value
              .filter(v => v.type === 'Tamanho')
              .forEach(sizeVariation => {
                sizeVariation.options.forEach(sizeOption => {
                  formattedVariations.push({ tamanho: sizeOption, cor: option })
                })
              })
          }
          else {
            formattedVariations.push({ cor: option })
          }
        }
        else if (variation.type === 'Estampa') {
          if (localVariations.value.some(v => v.type === 'Tamanho')) {
            localVariations.value
              .filter(v => v.type === 'Tamanho')
              .forEach(sizeVariation => {
                sizeVariation.options.forEach(sizeOption => {
                  formattedVariations.push({ tamanho: sizeOption, estampa: option })
                })
              })
          }
          else {
            formattedVariations.push({ estampa: option })
          }
        }
      })
    }
  })

  emit('update:variations', formattedVariations)
}

// Função para adicionar uma nova variação
function addVariation() {
  if (localVariations.value.length < 2) {
    localVariations.value.push({ id: localVariations.value.length + 1, type: '', options: [''] })
    updateParentVariations()
  }
}

// Função para remover uma variação existente
function removeVariation(id) {
  localVariations.value = localVariations.value.filter(variation => variation.id !== id)
  updateParentVariations()
}

// Função para adicionar uma nova opção a uma variação específica
function addOption(variationIndex) {
  localVariations.value[variationIndex].options.push('')
  updateParentVariations()
}

// Função para remover uma opção específica de uma variação
function removeOption(variationIndex, optionIndex) {
  if (localVariations.value[variationIndex].options.length > 1) {
    localVariations.value[variationIndex].options.splice(optionIndex, 1)
    updateParentVariations()
  }
}

// Observa mudanças no array de variações locais e emite quando ocorrerem
watch(localVariations, () => {
  updateParentVariations()
}, { deep: true })
</script>

<template>
  <div>
    <VRow>
      <VCol md="12">
        <!-- 👉 Product Information -->
        <VCard
          class="mb-6"
          title="Informações do Produto"
        >
          <VCardText>
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="props.product.nome"
                  label="Nome do Produto"
                  placeholder="Camiseta Masculina"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="props.product.sku"
                  label="SKU"
                  placeholder="SKU-1234"
                />
              </VCol>
              <VCol
                cols="12"
                md="12"
              >
                <span class="mb-1">Descrição do Produto</span>
                <TiptapEditor
                  v-model="props.product.descricao"
                  placeholder="Descrição do Produto"
                  class="border rounded"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <!-- Variations Card -->
        <VCard
          title="Variações"
          class="mb-6"
        >
          <VCardText>
            <template
              v-for="(variation, index) in localVariations"
              :key="variation.id"
            >
              <VAlert
                color="secondary"
                variant="outlined"
                class="mb-3 position-relative variation-card"
              >
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h4 class="mb-0">
                    Variação {{ variation.id }}
                  </h4>
                  <div class="flex-grow-1" />
                  <VBtn
                    icon
                    color="error"
                    class="btn-small"
                    @click="removeVariation(variation.id)"
                  >
                    <VIcon>mdi-close</VIcon>
                  </VBtn>
                </div>
                <VRow class="align-items-center">
                  <!-- Tipo da Variação -->
                  <VCol
                    cols="12"
                    md="4"
                  >
                    <AppSelect
                      v-model="variation.type"
                      :items="['Tamanho', 'Cor', 'Estampa']"
                      placeholder="Selecionar Tipo"
                      class="form-control"
                    />
                  </VCol>

                  <!-- Inputs de valores dinâmicos -->
                  <template
                    v-for="(option, optIndex) in variation.options"
                    v-if="variation.type"
                    :key="optIndex"
                  >
                    <VCol
                      cols="12"
                      md="4"
                      class="d-flex align-items-center gap-2 variation-input-group"
                    >
                      <AppAutocomplete
                        v-model="variation.options[optIndex]"
                        :items="suggestionMap[variation.type] || []"
                        placeholder="Adicionar Valor"
                        class="form-control"
                      />
                      <VBtn
                        icon
                        color="success"
                        class="btn-small"
                        @click="addOption(index)"
                      >
                        <VIcon>mdi-plus</VIcon>
                      </VBtn>
                      <VBtn
                        v-if="variation.options.length > 1"
                        icon
                        color="error"
                        class="btn-small"
                        @click="removeOption(index, optIndex)"
                      >
                        <VIcon>mdi-delete</VIcon>
                      </VBtn>
                    </VCol>
                  </template>
                </VRow>
              </VAlert>
            </template>
            <div class="d-flex gap-4 align-center">
              <VBtn
                v-if="localVariations.length < 2"
                color="primary"
                @click="addVariation"
              >
                Adicionar Variação
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss" scoped>
.v-card {
  .variation-card {
    padding: 1rem;
    border-radius: 8px;

    h4 {
      margin: 0;
      font-size: 1.2rem;
    }

    .btn-small {
      width: 28px;
      height: 28px;
      min-width: 28px;
      min-height: 28px;
      padding: 0;
    }

    .variation-input-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .form-control {
      width: 100%;
    }
  }
}
</style>
