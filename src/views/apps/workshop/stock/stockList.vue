<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { VBtn, VCard, VCardText, VCol, VRow, VSelect, VTextField } from 'vuetify/components'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { useStockStore } from '@/views/apps/workshop/stock/stockStore'
import type { IQueryStock } from '@/views/apps/workshop/stock/types'
import StockAddEditDialog from '@/views/apps/workshop/stock/component/StockAddEditDialog.vue'

// Pinia Store
const stockStore = useStockStore()

// Configuração inicial de busca
const searchQuery = ref('')
const selectedStatus = ref<'ativo' | 'inativo' | undefined>(undefined)
const isStockAddDialogVisible = ref(false)

const queryParams = ref<IQueryStock>({
  status: 'ativo',
  limit: 10,
  page: 1,
})

// Headers da tabela
const headers = [
  { title: '', key: 'data-table-expand' },
  { title: 'Produto', key: 'nome' },
  { title: 'SKU', key: 'sku' },
  { title: 'Estoque Total', key: 'estoqueTotal' },
]

// Computed para produtos filtrados
const filteredStocks = computed(() => {
  return stockStore.products.produtos.filter(stock => {
    const matchesSearch
      = searchQuery.value === ''
      || stock.nome.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus
      = !selectedStatus.value || stock.status === selectedStatus.value

    return matchesSearch && matchesStatus
  })
})

// Função para buscar estoques
async function fetchStock() {
  queryParams.value.status = selectedStatus.value || 'ativo'
  queryParams.value.page = 1 // Resetar para a primeira página ao aplicar filtro
  await stockStore.fetchStock(queryParams.value)
}

// Buscar os dados na montagem do componente
onMounted(() => {
  fetchStock()
})
</script>

<template>
  <div>
    <!-- Filtros -->
    <VCard
      title="Filtros"
      class="mb-6"
    >
      <VCardText>
        <VRow>
          <!-- Campo de busca -->
          <VCol
            cols="12"
            sm="8"
          >
            <VTextField
              v-model="searchQuery"
              placeholder="Buscar pelo nome"
              density="compact"
              @input="fetchStock"
            />
          </VCol>
          <!-- Filtro de status -->
          <VCol
            cols="12"
            sm="4"
          >
            <VSelect
              v-model="selectedStatus"
              :items="[{ title: 'Ativo', value: 'ativo' }, { title: 'Inativo', value: 'inativo' }]"
              clearable
              clear-icon="tabler-x"
              placeholder="Status"
              density="compact"
              @change="fetchStock"
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Botão e tabela -->
    <div class="d-flex justify-space-between align-center mb-4">
      <VBtn
        color="primary"
        prepend-icon="tabler-plus"
        @click="isStockAddDialogVisible = !isStockAddDialogVisible"
      >
        Cadastrar Estoque
      </VBtn>
      <StockAddEditDialog v-model:isDialogVisible="isStockAddDialogVisible" />
    </div>

    <!-- Tabela -->
    <VDataTable
      :headers="headers"
      :items="filteredStocks"
      :items-per-page="10"
      expand-on-click
    >
      <!-- Linha expandida -->
      <template #expanded-row="slotProps">
        <tr class="v-data-table__tr">
          <td :colspan="headers.length">
            <div class="my-1">
              <div
                v-for="variacao in slotProps.item.raw.variacoes"
                :key="variacao.cor + variacao.tamanho"
                class="mb-2"
              >
                <strong>
                  Estampa: {{ variacao.estampa }} - {{ variacao.tamanho }}
                </strong>
                <span>
                  Estoque: {{ variacao.quantidade }}
                </span>
              </div>
            </div>
          </td>
        </tr>
      </template>
    </VDataTable>
  </div>
</template>

<style scoped>
.v-card {
  .v-select,
  .v-text-field {
    margin-bottom: 0 !important;
  }
}
</style>
