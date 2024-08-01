<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue'
import { useCalculateMarketPlacesStore } from '../../CalculateMarketPlacesStore'
import { tableCalcStore } from '../table/tableCalcStore'

const storeCalc = tableCalcStore()
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:isDialogVisible'])

const store = useCalculateMarketPlacesStore()

const isDialogVisible = ref(props.isDialogVisible)
const name_product = ref('')
const description = ref('')

watch(() => props.isDialogVisible, newVal => {
  isDialogVisible.value = newVal
})

function closeDialog() {
  isDialogVisible.value = false
  emit('update:isDialogVisible', false)
}

async function formSubmit() {
  await store.setProductDetails(name_product.value, description.value)
  await store.create()
  closeDialog()
  storeCalc.fetchTableData()
}
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    :width="$vuetify.display.smAndDown ? 'auto' : 580"
  >
    <VCard title="Exportar Cálculo">
      <VCardText>
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="name_product"
              label="Nome do Produto"
              placeholder="Vestido"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="description"
              label="Descrição"
              placeholder="Vestido de festa"
            />
          </VCol>
        </VRow>
      </VCardText>
      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
          color="secondary"
          @click="closeDialog"
        >
          Fechar
        </VBtn>
        <VBtn @click="formSubmit">
          Salvar
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
