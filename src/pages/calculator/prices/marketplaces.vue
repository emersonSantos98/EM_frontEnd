<script setup lang="ts">
import { tableCalcStore } from '@/views/apps/calculator/components/table/tableCalcStore'
import CalculatorShopee from '@/views/apps/calculator/view/calculatorShopee.vue'
import TableCalc from '@/views/apps/calculator/components/table/tableCalc.vue'

const store = tableCalcStore()

store.fetchTableData()
</script>

<template>
  <div>
    <CalculatorShopee />
    <TableCalc />
  </div>
</template>

<route lang="yaml">
meta:
  action: read
  subject: Auth
</route>
