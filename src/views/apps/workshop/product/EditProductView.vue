<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/views/apps/workshop/product/useProduct'
import type { IQueryVariation, ProductType } from '@/views/apps/workshop/product/types'
import AddProductView from '@/views/apps/workshop/product/AddProductView.vue'

// Router, Store e estados reativos
const router = useRouter()
const route = useRoute()
const productStore = useProductStore()

const product = ref<ProductType>({
  nome: '',
  descricao: '',
  cor: '',
  sku: '',
  status: 'ativo',
  imagem: null,
})

const variations = ref<IQueryVariation[]>([])
const overlay = ref(true) // Overlay para carregamento da edição
const loadingSave = ref(false) // Loader para salvar atualização

const productId = route.params.all as string

onMounted(async () => {
  try {
    await productStore.findOneProduct(productId)
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
  } finally {
    overlay.value = false // Desativa overlay após carregar produto
  }
})

watch(
  () => productStore.findOne,
  newVal => {
    if (!newVal) return

    product.value = {
      nome: newVal.nome,
      descricao: newVal.descricao,
      cor: newVal.cor,
      sku: newVal.sku,
      status: newVal.status ?? 'ativo',
      imagem: newVal.imagem || null, // Mantém a imagem original se existir
    }

    variations.value = newVal.variacoes || []
  },
  { immediate: true }
)

async function updateProduct() {
  try {
    loadingSave.value = true // Ativar loading no botão

    const formData = new FormData()
    formData.append(
      'json',
      JSON.stringify({
        nome: product.value.nome,
        descricao: product.value.descricao,
        cor: product.value.cor,
        sku: product.value.sku,
        status: product.value.status,
        variacoes: variations.value,
      })
    )

    if (product.value.imagem instanceof File) {
      formData.append('image', product.value.imagem)
    }

    await productStore.updateProduct(productId, formData)
    router.push('/apps/workshop/product/list')
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
  } finally {
    loadingSave.value = false // Desativa loader
  }
}
</script>

<template>
  <div>
    <v-overlay v-model="overlay" class="d-flex justify-center align-center">
      <VProgressCircular indeterminate size="64" />
    </v-overlay>

    <div class="d-flex flex-wrap justify-between align-center gap-4 mb-6">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">Editar Produto</h4>
        <span>Atualize as informações do produto</span>
      </div>
    </div>

    <div class="d-flex gap-4 align-center mb-4">
      <VBtn color="warning" @click="$router.push('/apps/workshop/product/list')">
        <VIcon icon="tabler-arrow-big-left-lines" />
        Voltar
      </VBtn>
      <VBtn color="success" :loading="loadingSave" :disabled="!product.nome || !product.sku || !product.cor || variations.length === 0" @click="updateProduct">
        Salvar Alterações
      </VBtn>
    </div>

    <AddProductView v-model:product="product" v-model:variations="variations" />
  </div>
</template>
