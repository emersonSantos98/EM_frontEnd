<script setup lang="ts">
import { provide, ref } from 'vue'
import type { VForm } from 'vuetify/components'
import { useProductStore } from '@/views/apps/workshop/product/useProduct'
import type { IQueryVariation, ProductType } from '@/views/apps/workshop/product/types'
import AddProductView from '@/views/apps/workshop/product/AddProductView.vue'

// Store
const productStore = useProductStore()

// Form state
const formRef = ref<VForm | null>(null)

provide('formRef', formRef)

const product = ref<ProductType>({
  nome: '',
  descricao: '',
  sku: '',
  status: 'ativo',
})

const variations = ref<IQueryVariation[]>([])

// Salvar produto com variações
async function saveProduct() {
  try {
    const productData = {
      produto: product.value,
      variacoes: variations.value,
    }

    // Chama a store para adicionar o produto
    await productStore.addProduct(productData)
  }
  catch (error) {
    console.error('Erro ao salvar produto:', error)
  }
}
</script>

<template>
  <div>
    <!-- Cabeçalho e botões -->
    <div class="d-flex flex-wrap justify-between align-center gap-4 mb-6">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">
          Adicionar Produto
        </h4>
        <span>Preencha as informações do produto</span>
      </div>
    </div>
    <div class="d-flex gap-4 align-center">
      <VBtn
        color="warning"
        @click="$router.push('/apps/workshop/product/list')"
      >
        <VIcon icon="tabler-arrow-big-left-lines" />
        Voltar
      </VBtn>
    </div>
    <!-- Formulário de adição de produto -->
    <AddProductView
      v-model:variations="variations"
      v-model:product="product"
      class="mt-4"
    />
    <!-- Botão Salvar -->
    <VBtn
      color="success"
      @click="saveProduct"
    >
      Salvar Produto
    </VBtn>
  </div>
</template>
