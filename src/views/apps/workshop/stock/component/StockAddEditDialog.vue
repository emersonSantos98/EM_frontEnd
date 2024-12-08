<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { VBtn, VCard, VCardItem, VCardText, VCardTitle, VCol, VDialog, VForm, VRow, VTextField } from 'vuetify/components'
import { useStockStore } from '@/views/apps/workshop/stock/stockStore'

interface Emit {
  (e: 'submit', value: any): void
  (e: 'update:isDialogVisible', value: boolean): void
}

interface Props {
  isDialogVisible: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

// States
const selectedProduct = ref<string | null>(null)
const selectedVariation = ref<string | null>(null)
const quantity = ref<number | null>(null)
const description = ref<string>('Estoque inicial') // Descrição padrão
const movementType = ref<string>('entrada') // Tipo de movimentação padrão

// Store
const stockStore = useStockStore()

// Fetch variacoes sem estoque na montagem
onMounted(async () => {
  await stockStore.fetchVariacoesSemEstoque({ status: 'ativo', limit: 100, page: 1 })
})

// Variations based on selected product
const variationsWithoutStock = computed(() => {
  const product = stockStore.variacoesSemEstoque.produtos.find(p => p.id === selectedProduct.value)

  return product ? product.variacoes : []
})

// Submit logic
async function formSubmit() {
  if (selectedVariation.value && quantity.value !== null) {
    const payload = {
      estoque: {
        variacaoId: selectedVariation.value,
      },
      movimentacao: {
        tipo: movementType.value,
        quantidade: quantity.value,
        descricao: description.value,
      },
    }

    await stockStore.addStock(payload)
    stockStore.fetchStock({ status: 'ativo', limit: 10, page: 1 })
    emit('update:isDialogVisible', false)
  }
  else {
    console.error('Preencha todos os campos obrigatórios.')
  }
}

// Close modal
function dialogModelValueUpdate(val: boolean) {
  emit('update:isDialogVisible', val)
}

// Reset fields when modal is reopened
watch(() => props.isDialogVisible, newVal => {
  if (!newVal) {
    selectedProduct.value = null
    selectedVariation.value = null
    quantity.value = null
    description.value = 'Estoque inicial'
    movementType.value = 'entrada'
  }
})
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 600"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogModelValueUpdate"
  >
    <VCard class="pa-5 pa-sm-15">
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 font-weight-medium mb-4">
          Cadastrar Estoque
        </VCardTitle>
        <p class="mb-0">
          Preencha os campos abaixo para cadastrar um novo estoque
        </p>
      </VCardItem>

      <VCardText class="pt-6">
        <VForm @submit.prevent="formSubmit">
          <VRow>
            <!-- Produto -->
            <VCol cols="12">
              <VSelect
                v-model="selectedProduct"
                :items="stockStore.variacoesSemEstoque.produtos.map(p => ({ text: p.nome, value: p.id }))"
                label="Produto"
                item-title="text"
                placeholder="Selecione um produto"
                dense
                required
              />
            </VCol>

            <!-- Variações -->
            <VCol
              v-if="selectedProduct"
              cols="12"
            >
              <VSelect
                v-model="selectedVariation"
                :items="variationsWithoutStock.map(v => ({ text: `${v.cor} - ${v.tamanho}`, value: v.id }))"
                label="Variação"
                item-title="text"
                placeholder="Selecione uma variação"
                dense
                required
              />
            </VCol>

            <!-- Quantidade -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="quantity"
                type="number"
                label="Quantidade"
                placeholder="Digite a quantidade"
                dense
                required
              />
            </VCol>

            <!-- Descrição -->
            <VCol cols="12">
              <VTextField
                v-model="description"
                label="Descrição"
                placeholder="Descrição opcional"
                dense
              />
            </VCol>

            <!-- Ações -->
            <VCol
              cols="12"
              class="text-center"
            >
              <VBtn
                class="me-3"
                type="submit"
              >
                Cadastrar
              </VBtn>
              <VBtn
                color="secondary"
                variant="tonal"
                @click="dialogModelValueUpdate(false)"
              >
                Cancelar
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
