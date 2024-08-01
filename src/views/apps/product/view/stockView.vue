<script setup lang="ts">
import AddStock from '@/views/apps/product/components/stock/addStock.vue'
import SoldStock from '@/views/apps/product/components/stock/soldStock.vue'
</script>

<template>
  <VRow>
    <VCol cols="6">
      <AddStock />
    </VCol>
    <VCol cols="6">
      <SoldStock />
    </VCol>
  </VRow>
</template>

<style scoped lang="scss">

</style>
