<script lang="ts" setup>
interface IProps {
  modelValue: boolean,
  btnOkText?: string,
  btnCancelText?: string,
  title: string,
  message: string,
  btnOkColor?: string,
  btnCancelColor?: string,
  icon?: string,
}

interface IEmits {
  (e: 'update:modelValue', value: boolean): boolean
  (e: 'onHandleOk'): void
  (e: 'onHandleCancel'): void
}
const props = withDefaults(defineProps<IProps>(), {
  modelValue: false,
  btnOkText: 'Ok',
  btnCancelText: 'Cancel',
  title: 'Title',
  message: 'Message',
  btnOkColor: 'primary',
  btnCancelColor: 'medium-emphasis',
  icon: 'tabler-trash',
})

const emit = defineEmits<IEmits>()

const isDialogVisible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
const onHandleOk = () => {
  isDialogVisible.value = false
  emit('onHandleOk')
}

const onHandleCancel = () => {
  isDialogVisible.value = false
  emit('onHandleCancel')
}

</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    persistent
    class="v-dialog-sm"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard :title="props.title">
      <VCardText>
        {{ props.message }}
      </VCardText>

      <VCardText class="d-flex justify-end gap-3 flex-wrap">
        <VBtn
          :color="btnCancelColor"
          variant="tonal"
          @click="onHandleCancel"
        >
          {{ props.btnCancelText }}
        </VBtn>
        <VBtn
          @click="onHandleOk"
          :color="btnOkColor"
        >
          {{ props.btnOkText }}
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
