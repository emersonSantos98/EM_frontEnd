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
  { title: 'NAME', key: 'nome' },
  { title: 'SKU', key: 'sku' },
  { title: 'STATUS', key: 'status' },
  { title: 'DATE', key: 'createdAt' },
  { title: 'ACTIONS', key: 'actions' },
]

// Filtros
const selectedStatus = ref<'ativo' | 'inativo' | undefined>()
const searchQuery = ref('')

// Função para resolver o status
function resolveStatusVariant(status: string) {
  if (status === 'ativo')
    return { color: 'success', text: 'Active' }
  else if (status === 'inativo')
    return { color: 'error', text: 'Inactive' }
  else
    return { color: 'info', text: 'Unknown' }
}
function formatData(data: string) {
  return new Date(data).toLocaleDateString()
}

// Função para gerar as iniciais do nome, garantindo que fullName é uma string válida
function avatarText(fullName?: string) {
  if (!fullName)
    return 'N/A'
  const names = fullName.split(' ')

  return names.length > 1
    ? (names[0][0] + names[names.length - 1][0]).toUpperCase()
    : names[0][0].toUpperCase()
}

// Buscar os produtos da API na montagem do componente
async function fetchProducts() {
  await productStore.findAllProduct(
    {
      status: selectedStatus.value,
      search: searchQuery.value,
    },
  )
  products.value = productStore.products.produtos
}

// Chamando a função de buscar produtos ao montar o componente
onMounted(() => {
  fetchProducts()
})

// Função para deletar um produto
function deletePartner(id: string) {
  productStore.deleteProduct(id)
  products.value = products.value.filter(product => product.id !== id)
}

// Atualizar sempre que filtros ou paginação mudarem
watch([selectedStatus, searchQuery], fetchProducts)
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
          <!-- Buscar -->
          <VCol
            cols="12"
            sm="8"
          >
            <AppTextField
              v-model="searchQuery"
              placeholder="Buscar pelo nome"
              density="compact"
            />
          </VCol>
          <!-- Status -->
          <VCol
            cols="12"
            sm="4"
          >
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
    <VDataTable
      :headers="headers"
      :items="products"
      :items-per-page="5"
      expand-on-click
    >
      <!-- Linha expandida -->
      <template #expanded-row="slotProps">
        <tr class="v-data-table__tr">
          <td :colspan="headers.length">
            <div class="d-flex flex-column my-1">
              <div
                v-for="variacao in slotProps.item.raw.variacoes"
                :key="variacao.cor"
                class="d-flex align-items-center mb-2"
              >
                <div class="me-3">
                  <strong>Cor:</strong>
                  <VChip
                    label
                    color="secondary"
                    variant="elevated"
                    class="me-2"
                  >
                    {{ variacao.cor }}
                  </VChip>
                </div>
                <div>
                  <strong>Tamanhos:</strong>
                  <div class="d-flex flex-wrap gap-2">
                    <VChip
                      v-for="tamanho in variacao.tamanhos"
                      :key="tamanho"
                      label
                      color="secondary"
                      variant="elevated"
                    >
                      {{ tamanho }}
                    </VChip>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </template>

      <!-- Coluna Nome -->
      <template #item.nome="{ item }">
        <div class="d-flex align-center">
          <VAvatar
            size="32"
            color="primary"
            class="v-avatar-light-bg primary--text"
            variant="tonal"
          >
            <span>{{ avatarText(item.raw.nome) }}</span>
          </VAvatar>
          <div class="d-flex flex-column ms-3">
            <span class="d-block font-weight-medium text-high-emphasis text-truncate">{{ item.raw.nome }}</span>
            <small>{{ item.raw.sku }}</small>
          </div>
        </div>
      </template>

      <!-- Coluna Status -->
      <template #item.status="{ item }">
        <VChip
          :color="resolveStatusVariant(item.raw.status).color"
          class="font-weight-medium"
          size="small"
        >
          {{ resolveStatusVariant(item.raw.status).text }}
        </VChip>
      </template>
      <!-- Coluna Data -->
      <template #item.createdAt="{ item }">
        <span>{{ formatData(item.raw.createdAt) }}</span>
      </template>

      <!-- Ações -->
      <template #item.actions="{ item }">
        <IconBtn
          color="primary"
          @click="$router.push(`/apps/workshop/product/edit/${item.raw.id}`)"
        >
          <VIcon icon="tabler-edit" />
        </IconBtn>
        <IconBtn
          color="error"
          @click="deletePartner(item.raw.id)"
        >
          <VIcon icon="tabler-trash" />
        </IconBtn>
      </template>
    </VDataTable>
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
