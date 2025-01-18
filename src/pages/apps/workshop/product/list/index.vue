<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { VAvatar, VChip } from 'vuetify/components'
import { useProductStore } from '@/views/apps/workshop/product/useProduct'

// Store
const productStore = useProductStore()

// Estado local para armazenar os dados dos produtos
const products = ref(productStore.products.produtos)

// Headers da tabela
const headers = [
  { title: '', key: 'data-table-expand' },
  { title: 'Nome', key: 'nome' },
  { title: 'SKU', key: 'sku' },
  { title: 'Cor', key: 'cor' },
  { title: 'Status', key: 'status' },
  { title: 'Data de Criação', key: 'createdAt' },
  { title: 'Ações', key: 'actions' },
]

// Filtros
const selectedStatus = ref<'ativo' | 'inativo' | undefined>()
const searchQuery = ref('')

// Função para resolver o status
function resolveStatusVariant(status: string) {
  if (status === 'ativo') return { color: 'success', text: 'Ativo' }
  if (status === 'inativo') return { color: 'error', text: 'Inativo' }
  return { color: 'info', text: 'Desconhecido' }
}

function formatData(data: string) {
  return new Date(data).toLocaleDateString()
}

// Buscar os produtos da API na montagem do componente
async function fetchProducts() {
  await productStore.findAllProduct({
    status: selectedStatus.value,
    search: searchQuery.value,
  })
  products.value = productStore.products.produtos
}

// Chamando a função de buscar produtos ao montar o componente
onMounted(() => {
  fetchProducts()
})

// Função para deletar um produto
function deleteProduct(id: string) {
  productStore.deleteProduct(id)
  products.value = products.value.filter(product => product.id !== id)
}

// Atualizar sempre que filtros mudarem
watch([selectedStatus, searchQuery], fetchProducts)
</script>

<template>
  <div>
    <!-- Filtros -->
    <VCard title="Filtros" class="mb-6">
      <VCardText>
        <VRow>
          <!-- Buscar -->
          <VCol cols="12" sm="8">
            <AppTextField
              v-model="searchQuery"
              placeholder="Buscar pelo nome"
              density="compact"
            />
          </VCol>
          <!-- Status -->
          <VCol cols="12" sm="4">
            <AppSelect
              v-model="selectedStatus"
              placeholder="Status"
              :items="[{ title: 'Ativo', value: 'ativo' }, { title: 'Inativo', value: 'inativo' }]"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Botões e tabela -->
    <div class="d-flex justify-space-between align-center mb-4">
      <VBtn
        color="primary"
        prepend-icon="tabler-plus"
        @click="$router.push('/apps/workshop/product/add')"
      >
        Adicionar Produto
      </VBtn>
    </div>

    <!-- Tabela de Produtos -->
    <VDataTable
      :headers="headers"
      :items="products"
      :items-per-page="5"
      expand-on-click
    >
      <!-- Linha expandida com subtabela de variações -->
      <template #expanded-row="slotProps">
        <tr>
          <td :colspan="headers.length">
            <div class="subtable-container">
              <h5>Variações</h5>
              <VDataTable
                :headers="[
                  { title: 'Tamanho', key: 'tamanho' },
                  { title: 'Estampa', key: 'estampa' },
                  { title: 'Estoque', key: 'estoque' },
                  { title: 'SKU', key: 'sku' },
                  { title: 'Ações', key: 'actions' },
                ]"
                :items="slotProps.item.raw.variacoes"
                items-per-page-hidden
              >
                <!-- Coluna Tamanho -->
                <template #item.tamanho="{ item }">
                  <span>{{ item.value.tamanho }}</span>
                </template>
                <!-- Coluna Estampa -->
                <template #item.estampa="{ item }">
                  <span>{{ item.value.estampa }}</span>
                </template>
                <!-- Coluna Estoque -->
                <template #item.estoque="{ item }">
                  <span>{{ item.value.estoque }}</span>
                </template>
                <!-- Coluna SKU -->
                <template #item.sku="{ item }">
                  <span>{{ item.value.sku }}</span>
                </template>
                <!-- Coluna Ações -->
                <template #item.actions="{ item }">
                  <IconBtn color="error" @click="deleteProduct(item.raw.id)">
                    <VIcon icon="tabler-trash" />
                  </IconBtn>
                </template>
              </VDataTable>
            </div>
          </td>
        </tr>
      </template>

      <!-- Coluna Nome -->
      <template #item.nome="{ item }">
        <div class="d-flex align-center">
          <VAvatar
            v-if="item.raw.imagem"
            size="38"
            variant="tonal"
            rounded
            :image="item.raw.imagem"
          />
          <div class="ms-3">
            <span class="font-weight-medium">{{ item.raw.nome }}</span>
          </div>
        </div>
      </template>

      <!-- Coluna Cor -->
      <template #item.cor="{ item }">
        <span>{{ item.raw.cor }}</span>
      </template>

      <!-- Coluna Status -->
      <template #item.status="{ item }">
        <VChip
          :color="resolveStatusVariant(item.raw.status).color"
          size="small"
        >
          {{ resolveStatusVariant(item.raw.status).text }}
        </VChip>
      </template>

      <!-- Coluna Data -->
      <template #item.createdAt="{ item }">
        <span>{{ formatData(item.raw.createdAt) }}</span>
      </template>

      <!-- Coluna Ações -->
      <template #item.actions="{ item }">
        <IconBtn
          color="primary"
          @click="$router.push(`/apps/workshop/product/edit/${item.raw.id}`)"
        >
          <VIcon icon="tabler-edit" />
        </IconBtn>
        <IconBtn color="error" @click="deleteProduct(item.raw.id)">
          <VIcon icon="tabler-trash" />
        </IconBtn>
      </template>
    </VDataTable>
  </div>
</template>

<style scoped>
.subtable-container {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}
</style>
