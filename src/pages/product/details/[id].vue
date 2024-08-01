<script setup lang="ts">
import { useRoute } from 'vue-router'
import { watchEffect } from 'vue'
import CardViewDetails from '@/views/apps/product/view/details/cardViewDetails.vue'
import { tableListProductStore } from '@/views/apps/product/components/table/tableListProductStore'

const route = useRoute('product-details-id')
const store = tableListProductStore()

store.setFilter({ id: route.params.id })

function clearFilter() {
  store.clearFilter()
}

watchEffect(async () => {
  await store.fetchTableData()
})
</script>

<template>
  <div class="d-flex flex-column gap-6">
    <div class="demo-space-x">
      <VBtn
        color="primary"
        :to="{ name: 'product' }"
        @click="clearFilter"
      >
        <VIcon
          start
          icon="tabler-arrow-back-up"
        />
        Voltar
      </VBtn>
    </div>
    <CardViewDetails />
  </div>
</template>

<style scoped lang="scss">

</style>

<route lang="yaml">
meta:
  action: read
  subject: Auth
</route>
