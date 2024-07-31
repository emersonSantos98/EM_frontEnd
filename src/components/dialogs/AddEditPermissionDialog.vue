<script setup lang="ts">
interface Props {
  isDialogVisible: boolean
  permissionName?: string
}
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'update:permissionName', value: string): void
  (e: 'onSaveOrUpdate'): void
  (e: 'resetPermission'): void
}

const props = withDefaults(defineProps<Props>(), {
  permissionName: '',
})

const emit = defineEmits<Emit>()

const permissionName = ref('')

const onReset = () => {
  emit('update:isDialogVisible', false)
  emit('resetPermission')
}

const onSubmit = () => {
  emit('update:isDialogVisible', false)
  emit('update:permissionName', permissionName.value)
  emit('onSaveOrUpdate')
}

watch(props, () => {
  permissionName.value = props.permissionName
})
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 600"
    :model-value="props.isDialogVisible"
    @update:model-value="onReset"
  >
    <!-- 👉 dialog close btn -->
    <DialogCloseBtn @click="onReset" />

    <VCard class="pa-sm-8 pa-5">
      <!-- 👉 Title -->
      <VCardItem class="text-center">
        <VCardTitle class="text-h5">
          {{ props.permissionName ? $t('Edit') : $t('Add') }} Permission
        </VCardTitle>
        <VCardSubtitle>
          {{ props.permissionName ? $t('Edit') : $t('Add') }}  permission as per your requirements.
        </VCardSubtitle>
      </VCardItem>

      <VCardText class="mt-1">
        <!-- 👉 Form -->
        <VForm>
          <VAlert
            type="warning"
            title="Warning!"
            variant="tonal"
            class="mb-6"
          >
            {{ $t('By editing the permission name, you might break the system permissions functionality. Please ensure you\'re absolutely certain before proceeding.')}}
          </VAlert>

          <!-- 👉 Roles name -->
          <div class="d-flex align-end gap-3 mb-3">
            <AppTextField
              v-model="permissionName"
              density="compact"
              :label="$t('Permission Name')"
              :placeholder="$t('Enter Permission Name')"
            />

            <VBtn @click="onSubmit">
              {{ props.permissionName ? $t('save') : $t('Add') }}
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.permission-table {
  td {
    border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    padding-block: 0.5rem;
    padding-inline: 0;
  }
}
</style>
