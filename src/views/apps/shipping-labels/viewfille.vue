<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLabelOrganizerStore } from '@/views/apps/shipping-labels/labelOrganizerStore'
const store = useLabelOrganizerStore()
const generatedLabelUrl = computed(() => store.generatedLabelUrl)


</script>

<template>
  <VCard v-if="generatedLabelUrl" class="mb-6">
    <VCardTitle>
      Etiqueta de Envio Gerada
    </VCardTitle>

    <VCardText>
      <div class="flex justify-center">
        <iframe :src="generatedLabelUrl" width="100%" height="600px"></iframe>
      </div>
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">
.economia-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.strong {
  font-weight: bold;
}
</style>
