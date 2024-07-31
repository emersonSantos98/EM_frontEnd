<script setup lang="ts">
import StockView from '@/views/apps/product/view/stockView.vue'
</script>

<template>
  <div>
    <StockView />
  </div>
</template>

<style scoped lang="scss">

</style>
<route lang="yaml">
meta:
  action: read
  subject: Auth
</route>
