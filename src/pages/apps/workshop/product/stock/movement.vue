<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useInventoryStore } from '@/views/apps/workshop/stock/inventoryMovementStore'

const inventoryStore = useInventoryStore()
const currentTab = ref('entrada')
const isLoading = ref(false)
// Formulário inicial
const form = ref({
  tipo: 'entrada',
  quantidade: null,
  descricao: '',
  estoqueId: '',
  dataMovimentacao: '',
})

// Busca os dados de estoque ao carregar o componente
onMounted(async () => {
  try {
    await inventoryStore.fetchSelectedEstoque()
  }
  catch (error) {
    console.error('Erro ao buscar dados de estoque:', error)
  }
})

// Reseta o formulário
function resetForm() {
  form.value = {
    tipo: currentTab.value,
    quantidade: null,
    descricao: '',
    estoqueId: '',
    dataMovimentacao: '',
  }
}

// Define a data e hora atual
function getCurrentDateTime() {
  const now = new Date()

  return now.toISOString()
}

// Envia os dados do formulário
async function submitForm() {
  try {
    isLoading.value = true
    form.value.tipo = currentTab.value
    form.value.dataMovimentacao = getCurrentDateTime()

    await inventoryStore.addMovement(form.value)
    resetForm()
  }
  catch (error) {
    console.error('Erro ao salvar movimentação:', error)
    alert('Erro ao salvar movimentação.')
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <VCard>
    <!-- Tabs -->
    <VTabs
      v-model="currentTab"
      grow
    >
      <VTab
        value="entrada"
        color="success"
      >
        <VIcon
          icon="tabler-arrow-big-up-lines"
          class="mb-2"
        />
        <span>Entrada</span>
      </VTab>
      <VTab
        value="saida"
        color="error"
      >
        <VIcon
          icon="tabler-arrow-big-down-lines"
          class="mb-2"
        />
        <span>Saída</span>
      </VTab>
    </VTabs>

    <!-- Formulário -->
    <VCardText>
      <VForm @submit.prevent="submitForm">
        <VRow>
          <!-- Quantidade -->
          <VCol cols="12">
            <VTextField
              v-model="form.quantidade"
              label="Quantidade"
              placeholder="Digite a quantidade"
              type="number"
              required
            />
          </VCol>

          <!-- Descrição -->
          <VCol cols="12">
            <VTextarea
              v-model="form.descricao"
              label="Descrição"
              placeholder="Digite a descrição"
              rows="3"
              required
            />
          </VCol>

          <!-- Estoque (Selecionado da Store) -->
          <VCol cols="12">
            <VAutocomplete
              v-model="form.estoqueId"
              :items="inventoryStore.list.map(item => ({
                value: item.estoqueId,
                text: `${item.nome}-Estampa:${item.estampa}-Tamanho:${item.tamanho}`,
                image: item.imagem,
              }))"
              label="ID do Estoque"
              placeholder="Selecione"
              item-title="text"
              item-value="value"
              required
            >
              <template #item="{ props, item }">
                <VListItem v-bind="props">
                  <template #prepend>
                    <VAvatar
                      rounded="lg"
                      size="40"
                    >
                      <VImg
                        :src="item.raw.image"
                        cover
                      />
                    </VAvatar>
                  </template>
                </VListItem>
              </template>
            </VAutocomplete>
          </VCol>

          <!-- Botões -->
          <VCol
            cols="12"
            class="d-flex gap-4"
          >
            <VBtn
              type="submit"
              color="primary"
              :loading="isLoading"
            >
              Salvar
            </VBtn>
            <VBtn
              type="reset"
              color="secondary"
              variant="tonal"
              @click="resetForm"
            >
              Resetar
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>
