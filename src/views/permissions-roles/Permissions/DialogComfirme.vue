<script setup lang="ts">
interface IProps {
  modelValue: boolean
}

interface IEmit {
  (e: 'update:modelValue', value: boolean): boolean
}
const props = defineProps<IProps>({
  isDialogVisible: false
})

const emit = defineEmits<IEmit>()

</script>

<template>
  <VDialog
    :model-value="props.isDialogVisible"
    max-width="740"
    @update:model-value="dialogVisibleUpdate"
  >
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn @click="$emit('update:isDialogVisible', false)" />

  </VDialog>
</template>

<style scoped lang="scss">

</style>
