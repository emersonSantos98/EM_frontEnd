<script setup lang="ts">
import { VDataTable } from 'vuetify/labs/VDataTable'
import { VOverlay } from 'vuetify/components'
import { computed, onMounted, ref, watch } from 'vue'
import { useProductStore } from '@/views/apps/workshop/product/useProduct'

// Store
const productStore = useProductStore()

// Estado local
const products = ref(productStore.products.produtos)
const loadingProducts = ref(productStore.loadingProducts) // Estado de carregamento da store
const overlay = ref(false) // Controle do overlay

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
  if (status === 'ativo')
    return { color: 'success', text: 'Ativo' }
  if (status === 'inativo')
    return { color: 'error', text: 'Inativo' }

  return { color: 'info', text: 'Desconhecido' }
}

function formatData(data: string) {
  return new Date(data).toLocaleDateString()
}

// Buscar os produtos da API na montagem do componente
async function fetchProducts() {
  overlay.value = true // Ativar overlay ao buscar produtos
  loadingProducts.value = true

  await productStore.findAllProduct({
    status: selectedStatus.value,
    search: searchQuery.value,
  })

  products.value = productStore.products.produtos
  loadingProducts.value = false
  overlay.value = false // Desativar overlay após carregar
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

// Função para deletar uma variação
function deleteVariation(id: string) {
  productStore.deleteVariation(id)

  // Atualizar a lista de variações localmente
  products.value = products.value.map(produto => ({
    ...produto,
    variacoes: produto.variacoes.filter(variacao => variacao.variacaoId !== id),
  }))
}

// Atualizar sempre que filtros mudarem
watch([selectedStatus, searchQuery], fetchProducts)

// Computed para verificar se não há produtos
const noProducts = computed(() => !loadingProducts.value && products.value.length === 0)
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
        :loading="loadingProducts"
        :disabled="loadingProducts"
        @click="$router.push('/apps/workshop/product/add')"
      >
        Adicionar Produto
      </VBtn>
    </div>

    <!-- Overlay de carregamento -->
    <VOverlay
      v-model="overlay"
      class="d-flex justify-center align-center"
    >
      <VProgressCircular
        indeterminate
        size="64"
      />
    </VOverlay>

    <!-- Tabela de Produtos -->
    <VDataTable
      v-if="!noProducts"
      :headers="headers"
      :items="products"
      :items-per-page="5"
      expand-on-click
      :loading="loadingProducts"
      :show-expand="item => item.variacoes.length > 0"
    >
      <!-- Linha expandida com subtabela de variações -->
      <template #expanded-row="slotProps">
        <tr>
          <td :colspan="headers.length">
            <div class="subtable-container">
              <h5>Variações</h5>

              <!-- Se não houver variações, exibir mensagem -->
              <div
                v-if="slotProps.item.raw.variacoes.length === 0"
                class="text-center py-4"
              >
                <VIcon
                  icon="tabler-info-circle"
                  size="24"
                  color="grey"
                />
                <p>Nenhuma variação disponível.</p>
              </div>

              <VTable
                v-else
                class="text-no-wrap"
              >
                <thead>
                  <tr>
                    <th class="text-uppercase">
                      Tamanho
                    </th>
                    <th class="text-uppercase">
                      Estampa
                    </th>
                    <th class="text-uppercase">
                      Estoque
                    </th>
                    <th class="text-uppercase">
                      SKU
                    </th>
                    <th class="text-uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in slotProps.item.raw.variacoes"
                    :key="item.variacaoId"
                  >
                    <td>{{ item.tamanho }}</td>
                    <td>{{ item.estampa }}</td>
                    <td>{{ item.estoque }}</td>
                    <td>{{ item.sku }}</td>
                    <td>
                      <IconBtn
                        color="error"
                        @click="deleteVariation(item.variacaoId)"
                      >
                        <VIcon icon="tabler-trash" />
                      </IconBtn>
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </div>
          </td>
        </tr>
      </template>

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

      <!-- Coluna Ações -->
      <template #item.actions="{ item }">
        <IconBtn
          color="primary"
          @click="$router.push(`/apps/workshop/product/edit/${item.raw.id}`)"
        >
          <VIcon icon="tabler-edit" />
        </IconBtn>
        <IconBtn
          color="error"
          @click="deleteProduct(item.raw.id)"
        >
          <VIcon icon="tabler-trash" />
        </IconBtn>
      </template>
    </VDataTable>

    <!-- Mensagem de Nenhum Produto -->
    <div
      v-else
      class="d-flex justify-center align-center text-center"
    >
      <div>
        <VIcon
          icon="tabler-box-off"
          size="48"
          color="grey"
        />
        <p>Nenhum produto encontrado.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.subtable-container {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}
</style>
