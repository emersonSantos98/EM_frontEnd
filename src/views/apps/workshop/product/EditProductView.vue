<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/views/apps/workshop/product/useProduct'
import type { IQueryVariation, ProductType } from '@/views/apps/workshop/product/types'

// Componente de formulário (reutilizado em criar e editar)
import AddProductView from '@/views/apps/workshop/product/AddProductView.vue'

// Router, Store e dados reativos
const router = useRouter()
const route = useRoute()
const productStore = useProductStore()

// Estado local (product + variations) que será ligado ao <AddProductView/>
const product = ref<ProductType>({
  nome: '',
  descricao: '',
  cor: '',
  sku: '',
  status: 'ativo',
  imagem: null, // Aqui pode ser File ou string (URL)
})

const variations = ref<IQueryVariation[]>([])

// Pegamos o ID do produto a editar (depende de como está definida sua rota)
const productId = route.params.all as string

// Ao montar o componente, chamamos a Store para buscar o produto no backend
onMounted(async () => {
  try {
    await productStore.findOneProduct(productId)
  } catch (error) {
    console.error('Erro ao buscar produto para edição:', error)
    // redirecionar ou exibir mensagem de erro, se necessário
  }
})

/**
 * Observa "productStore.findOne".
 * Quando o Store setar "findOne", copiamos para `product.value` e `variations.value`.
 */
watch(
  () => productStore.findOne,
  newVal => {
    if (!newVal) return

    // Ajustamos os campos do produto
    product.value = {
      nome: newVal.nome,
      descricao: newVal.descricao,
      cor: newVal.cor,
      sku: newVal.sku,
      status: newVal.status ?? 'ativo',
      // Se o backend devolver a "imagem" como URL/caminho, guardamos como string
      imagem: newVal.imagem || null,
    }

    // Copiamos as variações
    variations.value = newVal.variacoes || []
  },
  { immediate: true },
)

// Função que envia o PUT ao backend, chamando o store
async function updateProduct() {
  try {
    // Monta FormData
    const formData = new FormData()

    // Monta o objeto JSON
    formData.append(
      'json',
      JSON.stringify({
        nome: product.value.nome,
        descricao: product.value.descricao,
        cor: product.value.cor,
        sku: product.value.sku,
        status: product.value.status,
        variacoes: variations.value,
      }),
    )

    // Se "product.value.imagem" for um File, significa que o usuário trocou a imagem
    if (product.value.imagem instanceof File) {
      formData.append('image', product.value.imagem)
    }
    // Se for string (URL), não anexamos nada -> o backend mantém a imagem anterior

    // Chama o método do store para dar PUT /update/:id
    await productStore.updateProduct(productId, formData)

    // Redireciona (ou faça algo após sucesso)
    router.push('/apps/workshop/product/list')
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
  }
}
</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-between align-center gap-4 mb-6">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">
          Editar Produto
        </h4>
        <span>Atualize as informações do produto</span>
      </div>
    </div>

    <!-- Botões -->
    <div class="d-flex gap-4 align-center mb-4">
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
        @click="updateProduct"
      >
        Salvar Alterações
      </VBtn>
    </div>

    <!--
      Reaproveitamos o mesmo componente de formulário (AddProductView)
      para editar também.
    -->
    <AddProductView
      v-model:product="product"
      v-model:variations="variations"
    />
  </div>
</template>
