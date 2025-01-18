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
  cor: '',
  sku: '',
  status: 'ativo',
  imagem: null,
})

const variations = ref<IQueryVariation[]>([])

// Salvar produto com variações
async function saveProduct() {
  try {
    const formData = new FormData()

    // Monta os dados do produto no formato exigido pelo backend
    formData.append(
      'json',
      JSON.stringify({
        ...product.value,
        variacoes: variations.value,
      }),
    )

    // Adiciona a imagem ao formulário
    if (product.value.imagem) {
      formData.append('image', product.value.imagem as File)
    }

    // Chama a store para salvar o produto
    await productStore.addProduct(formData)

    // Limpa os campos do formulário
    resetForm()

    // Redireciona para a lista de produtos
    $router.push('/apps/workshop/product/list')
  } catch (error) {
    console.error('Erro ao salvar produto:', error)
  }
}

// Reseta os campos do formulário
function resetForm() {
  product.value = {
    nome: '',
    descricao: '',
    cor: '',
    sku: '',
    status: 'ativo',
    imagem: null,
  }
  variations.value = []
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
      <VBtn
        color="success"
        :disabled="!product.nome || !product.sku || !product.cor || variations.length === 0"
        @click="saveProduct"
      >
        Salvar Produto
      </VBtn>
    </div>
    <!-- Formulário de adição de produto -->
    <AddProductView
      v-model:variations="variations"
      v-model:product="product"
      class="mt-4 mb-12"
    />
  </div>
</template>
