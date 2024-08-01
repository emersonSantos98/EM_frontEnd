<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue'
import type { ProductData } from '../../types'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object as () => ProductData | null,
    default: null,
  },
})

const emit = defineEmits(['update:isDialogVisible', 'confirm-delete'])

const isDialogVisible = ref(props.isDialogVisible)

watch(() => props.isDialogVisible, newVal => {
  isDialogVisible.value = newVal
})

function closeDialog() {
  isDialogVisible.value = false
  emit('update:isDialogVisible', false)
}

function deleteItemConfirm() {
  if (props.item) {
    emit('confirm-delete', JSON.stringify(props.item.props.title.id))
  }
  closeDialog()
}
</script>

<template>
  <VDialog v-model="isDialogVisible" max-width="600px">
    <VCard>
      <VCardTitle>
         Tem certeza que deseja excluir o produto:
        {{ props.item?.props.title.name_product }}?
      </VCardTitle>

      <VCardActions>
        <VSpacer />

        <VBtn color="error" variant="outlined" @click="closeDialog">
          Cancelar
        </VBtn>

        <VBtn color="success" variant="elevated" @click="deleteItemConfirm">
          Confirmar
        </VBtn>

        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped lang="scss">
</style>
